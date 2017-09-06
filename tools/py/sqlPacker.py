# -*- coding:utf-8 -*-
__author__ = 'ruix'

import xlrd
import os
import re
import optparse
import json

FIRST_SHEET_IDX = 1
FIRST_ROW_IDX = 3
NAME_ROW_IDX=2
DB_NAME_ROW_IDX=0

# { 'hero':{'table':'hero', 'sql':'hero.sql', 'uq':'idx'}, 'soldier':{'table':'soldier', 'sql':'soldier.sql', 'uq':'idx'} }
CONFIG={}
# {'hero':[{'colName1':colValue1, 'colName2':colValue2}, {'colName1':colValue1, 'colName2':colValue2}],}
DATA={}
HAS_ERROR = False

textIdMap = {}

#获取文本索引的接口
#参数 _tid: 为数据表中填写的id值
#返回值：返回对应id的序号
def dpgTextById(_tid):
    strId = str(_tid).upper()
    
    if len(strId) <= 0:
        return ""

    if strId in textIdMap:
        return textIdMap[strId]

    return str(_tid).upper() #无效数据

def parse_text(_src, _lang):
    #load src
    print('[***Debug***] parse text  (%s) ' % (_src))
    xls_data_src = xlrd.open_workbook(_src, encoding_override="utf-8")
    print('[***Debug***] parse text Worksheet name(s):', xls_data_src.sheet_names())
    _sheet = xls_data_src.sheet_by_index(0)
    print('[***Debug***] parse sheet: (%s) (%d row, %d col)' % (_sheet.name, _sheet.nrows - 1, _sheet.ncols))

    for col in range(1, _sheet.ncols):
        cell_lang_type = _sheet.cell(0,col)
        lang_type = str(cell_lang_type.value)

        if lang_type != _lang:
            print('[***Debug***] skip language (%s)'%(lang_type))
            continue

        print('[***Debug***] parse language col : %d, language : (%s)'%(col, lang_type))
        
        for row in range(1, _sheet.nrows):
            cell_val_id = _sheet.cell(row, 0)    #第一列为id
            cell_val_text = _sheet.cell(row, col)  #从第二列开始是文本

            # if textIdMap.has_key(str(cell_val_id.value)):
            if str(cell_val_id.value) in textIdMap:
                print("[***Error***] duplicate string :(%s)"%(str(cell_val_id.value)))
            else:
                textIdMap[str(cell_val_id.value).upper()] = cell_val_text.value
        pass
    print('[***Debug***] parse text finished!~')

def loadCfg(_cfgFile):
    f=open(_cfgFile, 'r')
    for line in f:
        if line.startswith('#') or line.isspace():
            continue
        conf_line = line.strip('\n').strip(' ').split("|")
        if len(conf_line) != 4:
            print('[Error] config file is incorrect!~ make sure the configuration have 3 cols!!!')
            continue
        CONFIG[conf_line[0]]={'table':conf_line[1], 'sql':conf_line[2], 'uq':conf_line[3]}

    print(CONFIG)
    print('[Debug] load config done!.')

def loadData(_excel_dir):
    print('[***Debug***] begin to load data (%s)'%(_excel_dir))
    sheets = {}
    for root, dirs, files in os.walk(_excel_dir):
        for file in files:
            suffix = os.path.splitext(file)[1]
            if file.startswith('XXSG_') and suffix == '.xls':
                if file == 'XXSG_const.xls': #跳过常量表
                    continue
                name = re.compile(r'XXSG_(\w+).xls').match(file).group(1)
                sheets[name] = os.path.abspath(os.path.join(root, file))
                print('[***Debug***] found (%s) (%s)'%(name, os.path.abspath(os.path.join(root, file))))
                pass

    global DATA
    global HAS_ERROR
    DATA = {}
    for sheet in sheets:

        #跳过常量表和无关页签
        if sheet == 'const' or sheet not in CONFIG:
            continue
            
        DATA[sheet] = []
        xls = xlrd.open_workbook(sheets[sheet], encoding_override="utf-8")
        xls_sheet = xls.sheet_by_index(1)
        for row in range(FIRST_ROW_IDX, xls_sheet.nrows):
            
            dicRow = {}
            for col in range(0, xls_sheet.ncols):
                colName=xls_sheet.cell(DB_NAME_ROW_IDX, col).value

                if colName == '' or xls_sheet.cell(DB_NAME_ROW_IDX, col) == 0:
                    print('Error!! sheet (%s), col (%d), colName is empty, please fill place holder (_) !!'%(sheet, col))
                    HAS_ERROR = True

                if colName.startswith("_"):
                    # print("skip comments (%s)"%(colName))
                    continue

                val = xls_sheet.cell(row,col).value

                if colName.find("(str)") >= 0:
                    # print("Get Text for (%s)"%(val))
                    dicRow[colName.replace('(str)','')] = dpgTextById(val)
                elif colName.find('(json)')>=0 or str(val).find('[')>=0:
                    # pattern = re.compile('[\-?\d*\.]+')
                    pattern = re.compile(r'[:,\{\[]+([\-?\d.?]+)')

                    # print(sheet, colName, val)
                    # print(pattern.findall(val))
                    array= list(map(lambda x: int(x), pattern.findall(val)))
                    # print(colName, array)
                    dicRow[colName.replace('(json)','')] = str(array).strip('[').strip(']').replace(' ','')
                else:
                    if xls_sheet.cell(row,col).ctype == 2:
                        dicRow[colName] = int(val)
                    elif xls_sheet.cell(row,col).ctype == 1:
                        dicRow[colName] = val
                    else:
                        print("Error!! sheet (%s) row (%d) col (%d) is empty!!!"%(sheet, row, col))
                        
                        HAS_ERROR = True

            DATA[sheet].append(dicRow)
    print('[***Debug***] load data done!~')
    pass

def dumpSQLUpdate(_outDir):
    print('[Debug] begin to dump update sql to (%s)'%(_outDir))
    global DATA
    for sh in DATA.keys():
        d=DATA[sh]

        sqlFile=open('%s/update_%s'%(_outDir,CONFIG[sh]['sql']),'w')

        

        if len(d) == 0:
            #没有field
            sqlFile.close()
            continue

        fields = sorted(d[0].keys())

        # update city set col1 = (case idx when 1 then 3 when 2 then 5), col2 = (case idx when 1 then 4 when 2 then 6);
        sql = ''
        sql = sql + 'update %s set\n\t'%(CONFIG[sh]['table'])

        fieldIndex=0
        for field in fields:

            if field == CONFIG[sh]['uq']:
                #跳过索引
                continue
                pass

            caseStr=''
            for k in d:
                if type(k[field]) == str:
                    caseStr = caseStr + '\n\t\t when %s then "%s"'%(k[CONFIG[sh]['uq']], k[field])
                else:
                    caseStr = caseStr + '\n\t\t when %s then %s'%(k[CONFIG[sh]['uq']], k[field])
                
            if fieldIndex > 0:
                sql = sql + '\n\t,'
            sql = sql + '%s = (case %s %s end)'%(field, CONFIG[sh]['uq'], caseStr)
                 
            fieldIndex = fieldIndex + 1

        sql = sql + ';\n'

        sqlFile.write(sql)
        sqlFile.close()
        print('[Debug] dump update sql to (update_%s) done.'%(CONFIG[sh]['sql']))
        pass
    pass


def dumpSQLInsert(_outDir):
    print('[Debug] begin to dump insert sql to (%s)'%(_outDir))
    global DATA
    for sh in DATA.keys():
        d=DATA[sh]

        sqlFile=open('%s/insert_%s'%(_outDir,CONFIG[sh]['sql']),'w')

        

        if len(d) == 0:
            #没有field
            sqlFile.close()
            continue


        # insert into city (col1, col2, col3) values (1,2,3);
        # insert into city (col1, col2, col3) values (4,5,6);
        sql = ''

        fields = sorted(d[0].keys())
        fieldsStr = str(fields).replace('[','(').replace(']',')').replace('\'','')

        for k in d:
            values = []
            for field in fields:
                values.append(k[field])
            valuesStr = str(values).replace('[','(').replace(']',')')

            sql = sql + 'insert ignore into %s '%(CONFIG[sh]['table'])
            sql = sql + '%s values '%(fieldsStr)
            sql = sql + '%s;\n'%(valuesStr)
                
        sqlFile.write(sql)
        sqlFile.close()
        print('[Debug] dump insert sql to (insert_%s) done.'%(CONFIG[sh]['sql']))
        pass
    pass

def dumpSQLInsertMerged(_outDir):
    print('[Debug] begin to dump merged insert sql to (%s)'%(_outDir))
    global DATA
    sqlFile=open('%s/insert.sql'%(_outDir),'w')

    sql = ''

    for sh in DATA.keys():
        d=DATA[sh]

        if len(d) == 0:
            #没有field
            sqlFile.close()
            continue


        # insert into city (col1, col2, col3) values (1,2,3);
        # insert into city (col1, col2, col3) values (4,5,6);
        sql = sql + '\n\n'

        fields = sorted(d[0].keys())
        fieldsStr = str(fields).replace('[','(').replace(']',')').replace('\'','')

        sql = sql + 'insert ignore into %s '%(CONFIG[sh]['table'])
        sql = sql + '%s values '%(fieldsStr)

        i=0
        for k in d:
            values = []
            for field in fields:
                values.append(k[field])
            valuesStr = str(values).replace('[','(').replace(']',')')
            if i>0:
                sql = sql + ',%s\n'%(valuesStr)
            else:
                sql = sql + '%s\n'%(valuesStr)
            i = i+1
        sql = sql + ';\n'
        pass

    sqlFile.write(sql)
    sqlFile.close()
    print('[Debug] dump insert sql to (insert.sql) done.')
    pass


def dumpSQLDelete(_outDir):
    print('[Debug] begin to dump delete sql to (%s)'%(_outDir))
    global DATA
    for sh in DATA.keys():
        d=DATA[sh]

        sqlFile=open('%s/delete_%s'%(_outDir,CONFIG[sh]['sql']),'w')

        if len(d) == 0:
            #没有field
            sqlFile.close()
            continue

        fields = sorted(d[0].keys())

        # update city set col1 = (case idx when 1 then 3 when 2 then 5), col2 = (case idx when 1 then 4 when 2 then 6);
        # delete from city where idx not in (1,2,3,4,5,6);
        sql = ''
        sql = sql + 'delete from %s where %s not in ('%(CONFIG[sh]['table'], CONFIG[sh]['uq'])

        dIndex = 0
        for k in d:
            if dIndex == 0:
                sql = sql + '%s'%(k[CONFIG[sh]['uq']])
            else:
                sql = sql + ', %s'%(k[CONFIG[sh]['uq']])
                 
            dIndex += 1
                
        sql = sql + ');\n'

        sqlFile.write(sql)
        sqlFile.close()
        print('[Debug] dump delete sql to (delete_%s) done.'%(CONFIG[sh]['sql']))
        pass
    pass


def dumpSQLReplace(_outDir):
    print('[Debug] begin to dump replace sql to (%s)'%(_outDir))
    global DATA
    for sh in DATA.keys():
        d=DATA[sh]

        sqlFile=open('%s/replace_%s'%(_outDir,CONFIG[sh]['sql']),'w')
        if len(d) == 0:
            #没有field
            sqlFile.close()
            continue

        fields = sorted(d[0].keys())

        # replace into city (col1, col2, col3) values (1,2,3),(4,5,6);
        sql = ''
        sql = sql + 'replace into %s '%(CONFIG[sh]['table'])

        fieldsStr = str(fields).replace('[','(').replace(']',')').replace('\'','')

        sql = sql + '%s values \n'%(fieldsStr)

        dIndex=0
        for k in d:
            values = []
            for field in fields:
                values.append(k[field])
            if dIndex > 0:
                sql = sql + '\n,'

            valuesStr = str(values).replace('[','(').replace(']',')')
            sql = sql + '%s'%(valuesStr)
                 
            dIndex = dIndex + 1

        sql = sql + ';\n'

        sqlFile.write(sql)
        sqlFile.close()
        print('[Debug] dump replace sql to (replace_%s) done.'%(CONFIG[sh]['sql']))
        pass
    pass

def generate_camel_name(_name):
	values = u""
	name_slice = _name.split('_')
	for x in name_slice:
		values = values + x[0].upper() + x[1:]
	return values


# special case for all constant variables in game.
def dumpConstant(_excel_dir, _outDir):
    print('[***Debug***] begin to dump constant data (%s)'%(_excel_dir))
    constant  = []

    xls = xlrd.open_workbook(_excel_dir+'/XXSG_const.xls', encoding_override="utf-8")
    sheet = xls.sheet_by_index(1)
    for row in range(FIRST_ROW_IDX, sheet.nrows):
        dicRow = {}
        key = sheet.cell(row, 0).value
        value = ''
        if sheet.cell(row, 1).ctype == 2:
            value = str(int(sheet.cell(row, 1).value))
        elif sheet.cell(row, 1).ctype == 1:
            pattern = re.compile(r'[:,\{\[]+([\-?\d.?]+)')
            # print(sheet, colName, val)
            # print(pattern.findall(val))
            val = sheet.cell(row, 1).value
            # print(val)
            array = list(map(lambda x: int(x), pattern.findall(val)))
            value = str(array).strip('[').strip(']').replace(' ','')

        else:
            print('Error!!! invalid value at (%d,%d)'%(row ,1))

        dicRow['name'] = key
        dicRow['value'] = value
        constant.append(dicRow)
    
    sqlFile=open('%s/insert_%s'%(_outDir,'constant.sql'),'w')
    sql = 'delete from const_cfg;\n'
    for d in constant:
        # insert into city (col1, col2, col3) values (1,2,3);
        fields = sorted(d.keys())
        fieldsStr = str(fields).replace('[','(').replace(']',')').replace('\'','')

        values = []
        for field in fields:
            values.append(d[field])
        valuesStr = str(values).replace('[','(').replace(']',')')

        sql = sql + 'insert into %s '%('const_cfg')
        sql = sql + '%s values '%(fieldsStr)
        sql = sql + '%s;\n'%(valuesStr)
    # print(sql)
    sqlFile.write(sql)
    sqlFile.close()

def main():
    parser = optparse.OptionParser("usage%prog -c <config file>")
    parser.add_option('-c', dest='conf', type='string', help='specify config file')
    parser.add_option('-d', dest='data', type='string', help='specify data file')
    parser.add_option('-o', dest='output', type='string', help='specify output file')

    (options, args) = parser.parse_args()

    parse_text(os.path.join(options.data, 'data_text.xls'), 'zh')
    
    loadCfg(options.conf)
    loadData(options.data)

    if HAS_ERROR: exit(1)

    dumpSQLReplace(options.output)
    dumpSQLUpdate(options.output)
    dumpSQLDelete(options.output)
    dumpSQLInsert(options.output)
    dumpSQLInsertMerged(options.output)
    dumpConstant(options.data, options.output)

if __name__ == "__main__":
    main()


