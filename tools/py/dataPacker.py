# -*- coding:utf-8 -*-
__author__ = 'ruix'

import xlrd
import os
import re
import optparse
import json
import codecs

FIRST_SHEET_IDX = 1
FIRST_ROW_IDX = 3
NAME_ROW_IDX=2
DB_NAME_ROW_IDX=0

# {"string_key":{"zh":"", "en":""}}
textIdMap = {}

ignore_xls = []

#获取文本索引的接口
#参数 _tid: 为数据表中填写的id值
#返回值：返回对应id的序号
def dpgTextById(_tid):
    strId = str(_tid).upper()
    
    if len(strId) <= 0:
        return -1

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
    # print(textIdMap)

def dumpText(_ts_dir, _str_json_dir):
    print('[***Debug***] dump text to (%s) and (%s)'%(_ts_dir, _str_json_dir))

    # with codecs.open(_str_json_dir,'w','utf-8') as f: f.write(json.dumps(textIdMap,ensure_ascii=False, sort_keys=True))

    content = ''
    content = content + 'class TextIdx {\n'
    for key in sorted(textIdMap.keys()):
        content = content + '\tpublic static %s ="%s";\n'%(key.upper(),textIdMap[key])
        pass
    content = content + '}\n'

    with codecs.open(_ts_dir,'w','utf-8') as f: f.write(content)
    print('[***Debug***] dump text done!~')
    pass

def dumpData(_excel_dir, _json_dir, _beautify):
    
    loadIgore()

    sheets = {}
    for root, dirs, files in os.walk(_excel_dir):
        for file in files:
            suffix = os.path.splitext(file)[1]
            if file.startswith('GD_') and suffix == '.xls':
                # if file == 'XXSG_const.xls': #跳过常量表
                if file in ignore_xls:
                    continue
                name = re.compile(r'GD_(\w+).xls').match(file).group(1)
                sheets[name] = os.path.abspath(os.path.join(root, file))
                print('[***Debug***] found (%s) (%s)'%(name, os.path.abspath(os.path.join(root, file))))
                pass

    print('[***Debug***] begin to dump data (%s) to json (%s), with beautify : (%s)'%(_excel_dir, _json_dir, str(_beautify)))
    dic = {}
    for sheet in sheets.keys():
        #跳过常量表
        if sheet == 'const':
            continue

        print('[***Debug***] begin to dump table (%s) ...'%(sheet))

        dic[sheet] = {}
        xls = xlrd.open_workbook(sheets[sheet], encoding_override="utf-8")
        xls_sheet = xls.sheet_by_index(1)
        for row in range(FIRST_ROW_IDX, xls_sheet.nrows):
            dic[sheet][row] = {}
            for col in range(0, xls_sheet.ncols):
                colName=xls_sheet.cell(NAME_ROW_IDX, col).value

                if colName.startswith("_"):
                    # print("skip comments (%s)"%(colName))
                    continue

                val = xls_sheet.cell(row,col).value
                if colName.find("(str)") >= 0:
                    # print("Get Text for (%s)"%(val))
                    dic[sheet][row][colName.replace("(str)","")] = dpgTextById(val)

                elif colName.find("(json)") >= 0:
                    if xls_sheet.cell(row,col).ctype == 1 and val.find("[") >= 0:
                        pattern = "\{[\-?\d*\.,]*,\[[\-?\d*\.,]*\]\}"
                        dic_pattern = re.compile(pattern)
                        dic_array = dic_pattern.findall(val)

                        dic[sheet][row][colName.replace("(json)","")] = {}

                        for item in dic_array:
                            values=item.strip('{').strip('}').split(',')

                            pattern2 = "\[[\-?\d*\.,]*\]"
                            dic_pattern2 = re.compile(pattern2)
                            dic_array2 = dic_pattern2.findall(item)
                            # print("~~~item = ~~~~%s"%item)
                            
                            if len(values)>1:
                                k=values[0]
                                t = dic_array2[0]
                                v = list(map(lambda x: float(x), t.replace('[','').replace(']','').split(',')))
                                # print("~~~v = ~~~~", v)
                                dic[sheet][row][colName.replace("(json)","")][k]=v
                    else :
                        pattern = "\{[a-zA-Z\-?\d*\:?,]*[a-zA-Z\-?\d*\:?]\}"
                        # print(val)
                        # print(pattern)
                        dic_pattern = re.compile(pattern)
                        dic_array = dic_pattern.findall(val)
                        # print(dic_array)

                        has_complex = False
                        if len(re.compile(r'\{ *\{').findall(val))>0:
                            has_complex = True

                        # dic[sheet][row][colName] = list(map(lambda x: int(x), val.replace('[','').replace(']','').split(',')))
                        dic[sheet][row][colName.replace("(json)","")] = {}

                        idx = 0 #used to index params
                        for item in dic_array:

                            idx = idx + 1
                            pair=item.strip('{').strip('}').split(',')
                            # print("~~~item = ~~~~%s"%item)

                            if item.find(':')>=0:

                                if item.find('id:')>=0:
                                    patternID=re.compile("id\:[\-?\d*\.]+")
                                    arrayID=patternID.findall(item)

                                    try:
                                        jsonKey = arrayID[0].split(':')[1] #第一个必须是id
                                    except Exception as e:
                                        print("Error!! invalid value : "+item)
                                        raise e
                                    
                                    dic[sheet][row][colName.replace("(json)","")][jsonKey] = {}
                                    # print(jsonKey)
                                    for xx in pair:
                                        values = xx.split(':')
                                        if len(values)>1:
                                            k=values[0]
                                            v=values[1]
                                            dic[sheet][row][colName.replace("(json)","")][jsonKey][k]=int(v)
                                else:
                                    if has_complex:
                                        #used idx to index params
                                        dic[sheet][row][colName.replace("(json)","")][idx] = {}
                                        for xx in pair:
                                            values = xx.split(':')
                                            if len(values)>1:
                                                k=values[0]
                                                v=values[1]
                                                
                                                dic[sheet][row][colName.replace("(json)","")][idx][k]=int(v)
                                    else:
                                        for xx in pair:
                                            values = xx.split(':')
                                            if len(values)>1:
                                                k=values[0]
                                                v=values[1]
                                                
                                                dic[sheet][row][colName.replace("(json)","")][k]=int(v)

                            else:
                                values = pair
                                if len(values)>1:
                                    k=values[0]
                                    v=values[1]
                                    dic[sheet][row][colName.replace("(json)","")][k]=int(v)
                else:
                    if xls_sheet.cell(row,col).ctype == 1 and val.find("[") >= 0:
                        print(sheet, row, col)
                        dic[sheet][row][colName] = list(map(lambda x: int(x), val.replace('[','').replace(']','').split(',')))
                    else:
                        if xls_sheet.cell(row,col).ctype == 2:
                                dic[sheet][row][colName] = int(val)
                        else:
                            dic[sheet][row][colName] = val

        print('[***Debug***] pack (%s) done.'%(sheet))

    if _beautify:
        with codecs.open(_json_dir,'w','utf-8') as f: f.write(json.dumps(dic, indent=2, ensure_ascii=False, sort_keys=True))
    else:
        with codecs.open(_json_dir,'w','utf-8') as f: f.write(json.dumps(dic, ensure_ascii=False, sort_keys=True))

    print('[***Debug***] dump data done!~')
    pass

def dumpConst(_excel_dir, _ts_dir):
    xls = xlrd.open_workbook(_excel_dir+'/GD_const.xls', encoding_override="utf-8")

    content = ''
    content = content + 'class CONST_VALUES {\n'
    xls_sheet = xls.sheet_by_index(1)
    for row in range(FIRST_ROW_IDX, xls_sheet.nrows):
        if xls_sheet.cell(row,1).ctype == 1:

            if xls_sheet.cell(row,1).value.find('{')>=0:

                val = xls_sheet.cell(row,1).value
                pattern = "\{[\-?\d*,]*\-?\d*\}"
                dic_pattern = re.compile(pattern)
                dic_array = dic_pattern.findall(val)

                dic = {}

                for item in dic_array:
                    values=item.strip('{').strip('}').split(',')
                    if len(values)>1:
                        k=values[0]
                        v=values[1]
                        dic[k]=int(v)
                content = content + '\tpublic static CONST_%s =%s;\n'%(xls_sheet.cell(row,0).value.upper(), json.dumps(dic, ensure_ascii=False, sort_keys=True))
            else:
                content = content + '\tpublic static CONST_%s =%s;\n'%(xls_sheet.cell(row,0).value.upper(), xls_sheet.cell(row,1).value)
        else:
            content = content + '\tpublic static CONST_%s =%s;\n'%(xls_sheet.cell(row,0).value.upper(), int(xls_sheet.cell(row,1).value))

    content = content + '}\n'

    with codecs.open(_ts_dir,'w','utf-8') as f: f.write(content)
    print('[***Debug***] dump const value done!~')
    pass

def generate_variable_name_frist_lower(_name):
	values = u""
	name_slice = _name.split('_')
	for x in name_slice:
		values = values + x[0].upper() + x[1:]
	return values

def createInterfaceAndDataInfo(_excel_dir, _interface_dir):

    sheets = {}
    for root, dirs, files in os.walk(_excel_dir):
        for file in files:
            suffix = os.path.splitext(file)[1]
            if file.startswith('GD_') and suffix == '.xls':
                # if file == 'GD_const.xls': #跳过常量表
                if file in ignore_xls:
                    continue
                name = re.compile(r'GD_(\w+).xls').match(file).group(1)
                sheets[name] = os.path.abspath(os.path.join(root, file))
                print('[***Debug***] found (%s) (%s)'%(name, os.path.abspath(os.path.join(root, file))))
                pass

    for sheet in sheets.keys():

        #跳过常量表
        if sheet == 'const':
            continue

        print('generate interface %s'%(sheet))

        sheetName = generate_variable_name_frist_lower(sheet);
        interfaceFileName = _interface_dir + sheetName + 'DataInterface.ts'
        iFile = open(interfaceFileName, 'w')
        inf = ''
        # inf = inf + 'interface %sDataDict {\n'%(sheetName)
        # inf = inf + '\t[name:string]:%sDataInfo;\n'%(sheetName)
        # inf = inf + '}\n\n'
        inf = inf + 'interface %sDataInterface {\n'%(sheetName)
        xls = xlrd.open_workbook(sheets[sheet], encoding_override="utf-8")
        xls_sheet = xls.sheet_by_name(sheet)
        i = 0
        for col in range(0, xls_sheet.ncols):
            if i == 0:
                infItem = ''
            else:
                infItem = ',\n'
            colName = (xls_sheet.cell(NAME_ROW_IDX, col).value.split('('))[0]

            if colName.startswith('_'):
                # print("skip comments (%s)"%(colName))
                continue
                    
            infItem = infItem + '\t' + colName
            if xls_sheet.cell(FIRST_ROW_IDX,col).ctype == 1 or xls_sheet.cell(NAME_ROW_IDX, col).value.find('(bio)')>=0:
                # print(sheet,col)
                firstCellValue = xls_sheet.cell(FIRST_ROW_IDX,col).value
                if xls_sheet.cell(NAME_ROW_IDX, col).value.find('(json)')>=0:
                    if firstCellValue.find('[')>=0:
                        infItem = infItem + ':{[name:string]:Array<number>}'
                    else:
                        pattern = "\{[a-zA-Z\-?\d*\:?,]*[a-zA-Z\-?\d*\:?]\}"
                        dic_pattern = re.compile(pattern)
                        dic_array = dic_pattern.findall(firstCellValue)
                        # keyName = dic_array[0].strip('{').strip('}').split(',').split(':')

                        has_complex = False
                        if len(re.compile(r'\{ *\{').findall(firstCellValue))>0:
                            has_complex = True

                        if len(dic_array)>0:
                            item = dic_array[0]
                            pair=item.strip('{').strip('}').split(',')
                            if item.find(':')>=0:

                                keys = []
                                for xx in pair:
                                    values = xx.split(':')
                                    if len(values)>1:
                                        k=values[0]
                                        if not k in keys:
                                            keys.append(k)

                                # print(keys)

                                objStr = ''
                                objIdx=0
                                for key in keys:
                                    if objIdx == 0:
                                        objStr = objStr + '%s:number'%(key)
                                    else:
                                        objStr = objStr + ',%s:number'%(key)
                                    objIdx = objIdx + 1

                                if item.find('id:')>=0 or has_complex:
                                    infItem = infItem + ':{[name:string]:{%s}}'%(objStr)
                                else:
                                    infItem = infItem + ':{%s}'%(objStr)

                            else:
                                infItem = infItem + ':{[name:string]:number}'
                        else:
                            infItem = infItem + ':any'


                elif firstCellValue.find('[')>=0:
                    infItem = infItem + ':Array<number>'
                else:
                    infItem = infItem + ':string' 
            else:
                infItem = infItem + ':number'
            inf = inf + infItem
            i = i + 1
        inf = inf + '\n' + '}'
        iFile.write(inf)
        datainfoFileName = _interface_dir + '../' + sheetName + 'Data.ts'
        if not os.path.exists(datainfoFileName):
            cpp = ''
            cpp = cpp + 'class %sData {\n'%(sheetName)
            cpp = cpp + '\tprivate _data:%sDataInterface = null;\n'%(sheetName)
            cpp = cpp + '\tpublic constructor() {}\n'
            cpp = cpp + '\tprivate _key:string;\n'

            cpp = cpp + '\tpublic set key(v:string) {\n'
            cpp = cpp + '\t\tthis._key = v;\n'
            cpp = cpp + '\t}\n'
            cpp = cpp + '\tpublic get key():string {\n'
            cpp = cpp + '\t\treturn this._key;\n'
            cpp = cpp + '\t}\n'

            cpp = cpp + '\tpublic set data(v:%sDataInterface) {\n'%(sheetName)
            cpp = cpp + '\t\tthis._data = v;\n'
            cpp = cpp + '\t}\n'
            cpp = cpp + '\tpublic get data():%sDataInterface {\n'%(sheetName)
            cpp = cpp + '\t\treturn this._data;\n'
            cpp = cpp + '\t}\n'

            cpp = cpp + '}'

            with codecs.open(datainfoFileName,'w','utf-8') as f: f.write(cpp)
    pass

def loadIgore():
    with codecs.open('./data.conf', 'r', 'utf-8') as f:
        for line in f.readlines():
            ignore_xls.append(line.strip())
            pass
    pass

def main():
    parser = optparse.OptionParser("usage%prog -c <config file>")
    parser.add_option('-t', dest='text', type='string', help='specify text file')
    parser.add_option('-d', dest='data', type='string', help='specify data file')
    parser.add_option('-o', dest='output', type='string', help='specify output file')
    parser.add_option('-c', dest='constTS', type='string', help='specify the const value ts file')
    parser.add_option('-s', dest='textTS', type='string', help='specify the text ts file')
    parser.add_option('-j', dest='textJson', type='string', help='specify the text json file' )
    parser.add_option('-l', dest='language', type='string', default='zh', help='specify language type, only zh and en supported right now.')
    parser.add_option('-b', dest='beautify', action='store_true', default=False, help='beautify json or not')
    parser.add_option('-i', dest='interface', type='string', help='specify interface file')

    (options, args) = parser.parse_args()
    parse_text(options.data +"/data_text.xls", options.language)
    dumpData(options.data, options.output, options.beautify)

    # textIdMap.clear()
    parse_text(options.text, options.language)
    dumpText(options.textTS, options.textJson)

    dumpConst(options.data, options.constTS)

    createInterfaceAndDataInfo(options.data, options.interface)

if __name__ == "__main__":
    main()


