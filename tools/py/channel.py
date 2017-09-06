# -*- coding:utf-8 -*-
__author__ = 'ruix'
__doc__ = """
    history: 2017-03-20 initial
"""

import optparse
import os
import types
import json
import codecs
import re
from datetime import datetime

# gloabl
KEY_VERSION='version'
KEY_BUILDTIME='buildtime'
KEY_COMPATIBLE='compatible'
KEY_AUTH_MAP='authMap'
KEY_TALKINGDATA='talkingdataAppKey'

# channel
KEY_NAME='name'
KEY_PLAYER_CENTER='playerCenter'
KEY_PLAYER_CENTER_S='playerCenter_s'

# Additional
KEY_PAY_CENTER='payCenter'
KEY_PAY_CENTER_S='payCenter_s'
KEY_STATISTIC='statistic'
KEY_STATISTIC_S='statistic_s'
KEY_AUTH_TYPE='AuthType'
KEY_LIB_URL='libs'



# Place holder in template.html
GAME_NAME_PLACE_HOLDER='#NAME#'
CHANNEL_PLACE_HOLDER='#CHANNEL_CODE#'

# the asConfig.ts file. Need find a better way to handle this. [ruix]
ts_file='../../three_country/src/framework/utils/asConfig.ts'
project_root='../../three_country/'
# idx_file='../../three_country/index.html'
idx_template='../../tools/config/template.html'
game_name=u'点点三国'

conf={}

def prepare(_ch, _conf):
    print('[***Debug***] prepare for channel %s with config %s'%(_ch, _conf))
    global conf
    conf=json.load(codecs.open(_conf, 'r', 'utf-8'))
    channels=conf['channels']
    if _ch in channels:
        ch=channels[_ch]
        print("[***Debug***] \n%s"%(json.dumps(ch, indent=4)))
        # global
        ts=codecs.open(ts_file, 'r', 'utf-8').read()
        pattern = re.compile(r'let version = ".*";')
        ts=pattern.sub('let version = "%s";'%(conf[KEY_VERSION]), ts)

        pattern = re.compile(r'let buildtime = ".*";')
        ts=pattern.sub('let buildtime = "%s";'%(conf[KEY_BUILDTIME]), ts)

        # channel related
        pattern = re.compile(r'let name = ".*";')
        ts=pattern.sub('let name = "%s";'%(ch[KEY_NAME]), ts)

        pattern = re.compile(r'let pcUrl = ".*";')
        ts=pattern.sub('let pcUrl = "%s";'%(ch[KEY_PLAYER_CENTER]), ts)

        pattern = re.compile(r'let pcUrl_s = ".*";')
        ts=pattern.sub('let pcUrl_s = "%s";'%(ch[KEY_PLAYER_CENTER_S]), ts)

        # additional
        # pay center
        pattern = re.compile(r'let payCenter = ".*";')
        if KEY_PAY_CENTER in ch:
            ts=pattern.sub('let payCenter = "%s";'%(ch[KEY_PAY_CENTER]), ts)
        else:
            ts=pattern.sub('let payCenter = "%s";'%(conf[KEY_PAY_CENTER]), ts)

        pattern = re.compile(r'let payCenter_s = ".*";')
        if KEY_PAY_CENTER_S in ch:
            ts=pattern.sub('let payCenter_s = "%s";'%(ch[KEY_PAY_CENTER_S]), ts)
        else:
            ts=pattern.sub('let payCenter_s = "%s";'%(conf[KEY_PAY_CENTER_S]), ts)    
        
        # statistic
        pattern = re.compile(r'let statistic = ".*";')
        if KEY_STATISTIC in ch:
            ts=pattern.sub('let statistic = "%s";'%(ch[KEY_STATISTIC]), ts)
        else:
            ts=pattern.sub('let statistic = "%s";'%(conf[KEY_STATISTIC]), ts)

        pattern = re.compile(r'let statistic_s = ".*";')
        if KEY_STATISTIC_S in ch:
            ts=pattern.sub('let statistic_s = "%s";'%(ch[KEY_STATISTIC_S]), ts)
        else:
            ts=pattern.sub('let statistic_s = "%s";'%(conf[KEY_STATISTIC_S]), ts)

        # not used anymore!!
        # auth mode
        # pattern = re.compile(r'let authType = AuthType\..*;')
        # if KEY_AUTH_TYPE in ch:
        #     ts=pattern.sub('let authType = AuthType.%s;'%(ch[KEY_AUTH_TYPE]), ts)

        with codecs.open(ts_file, 'w', 'utf-8') as f: f.write(ts)

        print("[***Debug***] prepare for (%s) done!~"%(_ch))
    else:
        print("[***Error***] channel (%s) not existed in (%s)!"%(_ch, _conf))

    pass

def build(_ch, _platform, _version):
    print('[***Debug***] ')
    ori_path = os.getcwd()
    os.chdir(project_root)
    os.system('egret publish -version %s'%(_version))
    os.chdir(ori_path)
    pass

def processHtml(_ch, _output, _version):
    print('[***Debug***] begin process htmls...')

    compatible_chs=[]
    for k, v in conf[KEY_COMPATIBLE].items():
        if _ch in v:
            compatible_chs = v
            break

    if len(compatible_chs)>0:
        for c in compatible_chs:
            processIndexHtml(c, _output, _version)
            processFwdHtml(c, _output)
            pass
    else:
        processIndexHtml(_ch, _output, _version)
        processFwdHtml(_ch, _output)
    pass

def processIndexHtml(_ch, _output, _version):
    print('[***Debug***] process channel index.html for (%s)'%(_ch))
    ss=codecs.open(os.path.join(project_root, 'bin-release/web', _version, 'index.html'), 'r', 'utf-8').read()
    ch = conf['channels'][_ch]

    # channel code
    print('[***Debug***] process channel code ...')
    ss = ss.replace("var channelcode = 'default';", "var channelcode = '%s';"%(_ch))

    # statistic appkey
    print('[***Debug***] process talkingdata appkey ...')
    appkey = conf[KEY_TALKINGDATA]
    tglink=re.compile(r'(<script src="https://h5.talkingdata.com/g/h5/v1/.*"><\\/script>)').search(ss).group(1)
    if tglink != None:
        ss = ss.replace(tglink, '<script src="https://h5.talkingdata.com/g/h5/v1/%s"><\/script>'%(appkey))

    tglink=re.compile(r'(<script src="http://sdk.talkingdata.com/g/h5/v1/.*"><\\/script>)').search(ss).group(1)
    if tglink != None:
        ss = ss.replace(tglink, '<script src="http://sdk.talkingdata.com/g/h5/v1/%s"><\/script>'%(appkey))

    # auth type
    if KEY_AUTH_TYPE in ch:
        print('[***Debug***] process auth type ...')
        ss=ss.replace("var authtype = 0;", "var authtype = %d;"%(conf[KEY_AUTH_MAP][ch[KEY_AUTH_TYPE]]))    

    # append version
    print('[***Debug***] append version ...')
    ss=ss.replace('<script src="main.min.js"></script>', '<script src="main.min.js?%s"></script>'%(datetime.now().strftime('%Y%m%d%H%M%S')))

    # libs
    if KEY_LIB_URL in ch:
        print('[***Debug***] process libs ...')
        other_libs=re.compile(r"<!--other_libs_files_start-->[\n\t]*(.*)[\n\t]*<!--other_libs_files_end-->", re.S).search(ss).group(1)
        new_other_libs=other_libs
        libs = ch[KEY_LIB_URL]
        if new_other_libs.find(libs) < 0:
            print("[***Debug***] try to append libs (%s)"%(libs))
            if libs.find('http') < 0: # if has http or https, it should be not fetched by egret.
                new_other_libs = new_other_libs + '<script egret="lib" src="%s" src-release="%s"></script>\n\t'%(libs, libs)
            else:
                new_other_libs = new_other_libs + '<script type="text/javascript" src ="%s"></script>\n\t'%(libs)

        ss=ss.replace(other_libs, new_other_libs)

    #write channel index.html
    with codecs.open(os.path.join(_output, 'index_%s.html'%(_ch)), 'w', 'utf-8') as f: f.write(ss)

    print('[***Debug***] process channel index.html for (%s) done!~'%(_ch))
    pass

def processFwdHtml(_ch, _output):
    print("[***Debug***] process redirect index for (%s)..."%(_ch))
    ss = codecs.open(idx_template, 'r', 'utf-8').read()

    with codecs.open(os.path.join(_output,'index_%s_fwd.html'%(_ch)), 'w', 'utf-8') as f:
        f.write(ss.replace(CHANNEL_PLACE_HOLDER, _ch).replace(GAME_NAME_PLACE_HOLDER, game_name))

    print("[***Debug***] process redirect index for (%s) done!~"%(_ch))
    pass

    
def main():
    parser = optparse.OptionParser("usage%prog -f <config file>")
    parser.add_option('-v', dest='version', type='string', help='please specify version')
    parser.add_option('-f', dest='config', type='string', help='please specify config file')
    parser.add_option('-c', dest='channel', type='string', help='please specify channel')
    parser.add_option('-o', dest='output', type='string', help='please specify output directory')
    parser.add_option('-p', dest='platform', type='string', help='please specify platform code. wnai')

    (options, args) = parser.parse_args()

    if not os.path.exists(options.config):
        print('config (%s) not existed!'%(options.config))
        exit(1)
    
    prepare(options.channel, options.config)

    if options.platform:
        if options.platform.find('w')>=0:
            build(options.channel, options.platform, options.version)
            processHtml(options.channel, options.output, options.version)
        else:
            print('[***Error***] only web supported! Please specify your platform. Runtime, Android, iOS coming soon...')
            exit(1)
    

if __name__ == "__main__":
    main()


