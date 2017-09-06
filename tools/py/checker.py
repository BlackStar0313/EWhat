# -*- coding:utf-8 -*-
__author__ = 'ruix'

import optparse
import os
import types
import json
import codecs
from jsondiff import diff

FIRST_SHEET_IDX = 1
FIRST_ROW_IDX = 3
NAME_ROW_IDX=2
DB_NAME_ROW_IDX=0

# {"string_key":{"zh":"", "en":""}}
textIdMap = {}

def debug_log(_v):
    if isinstance(_v, str):
        print('[***Debug***] %s'%(_v))
    else:
        print('[***Debug***]', _v)

def check_format(_json_old_path, _json_new_path, _out):
    debug_log('check format (%s) (%s), output (%s)'%(_json_old_path, _json_new_path, _out))
    output = ''
    output = output + 'action'.ljust(20) + '|old'.ljust(20)+'|new'.ljust(20)+'\n'

    jsonOld=json.load(codecs.open(_json_old_path,'r', 'utf-8'))
    jsonNew=json.load(codecs.open(_json_new_path,'r', 'utf-8'))
    differences = diff(jsonOld, jsonNew, with_values=False)
    if len(differences) == 0:
        debug_log('they are the same!!')
        output = 'They are the same!\n'
    else:
        debug_log('they are different, please refer the (%s) for differences!~'%(_out))
        for (action, msg) in differences:
            output = output + ('%s'%(action)).ljust(20) + '|%s\n'%(msg)
    with codecs.open(_out, 'a', 'utf-8') as f: f.write(output)
    debug_log('check format done!~')
    pass

def compare(_json_old_path, _json_new_path, _out):
    debug_log('compare (%s) (%s), output (%s)'%(_json_old_path, _json_new_path, _out))
    output = ''
    output = output + 'action'.ljust(20) + '|old'.ljust(20)+'|right'.ljust(20)+'\n'

    jsonOld=json.load(codecs.open(_json_old_path,'r', 'utf-8'))
    jsonNew=json.load(codecs.open(_json_new_path,'r', 'utf-8'))
    differences = diff(jsonOld, jsonNew, with_values=True)
    if len(differences) == 0:
        debug_log('they are the same!!')
        output = 'They are the same!\n'
    else:
        debug_log('they are different, please refer the (%s) for differences!~'%(_out))
        for (action, msg) in differences:
            output = output + ('%s'%(action)).ljust(20) + '|%s\n'%(msg)
    with codecs.open(_out, 'a', 'utf-8') as f: f.write(output)
    debug_log('compare done!~')
    pass

def main():
    parser = optparse.OptionParser("usage%prog -c <config file>")
    parser.add_option('-l', dest='left', type='string', help='specify history json file')
    parser.add_option('-r', dest='right', type='string', help='specify new json file')
    parser.add_option('-o', dest='output', type='string', help='specify output file')
    parser.add_option('-v', dest='withvalue', action='store_true', default=False, help='specify compare with value or not')

    (options, args) = parser.parse_args()

    if os.path.exists(options.output): os.remove(options.output)
    if options.withvalue:
        compare(options.left, options.right, options.output)
    else:
        check_format(options.left, options.right, options.output)

if __name__ == "__main__":
    main()


