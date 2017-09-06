# -*- coding: utf-8 -*-
# Author: Rui Xie
# Date: 2016-06-29
# Description: 
# This script is used for exporting egret eui as typescript class
# to improve efficent for developement.

# History:
# 2016-06-29 by ruix: Initial version

from bs4 import BeautifulSoup
import os
import string
import json

ROOT_DIR = "../three_country/"
EUI_DIR = ROOT_DIR + "resource/eui_skins/"
SRC_DIR = ROOT_DIR + "src/layer/"
THM_DIR = ROOT_DIR + "resource/default.thm.json"

TAG_BITMAP_LABEL="e:BitmapLabel"
TAG_BUTTON="e:Button"
TAG_CHECKBOX="e:CheckBox"
TAG_COMPONET="e:Component"
TAG_DATAGROUP="e:DataGroup"
TAG_EDITABLE_TEXT="e:EditableText"
TAG_HSCROLLBAR="e:HScrollBar"
TAG_HSLIDER="e:HSlider"
TAG_IMAGE="e:Image"
TAG_LABEL="e:Label"
TAG_LIST="e:List"
TAG_PROGRESS_BAR="e:ProgressBar"
TAG_RECT="e:Rect"
TAG_TABBAR="e:TabBar"
TAG_TEXTINPUT="e:TextInput"
TAG_TOGGLE_BUTTON="e:ToggleButton"
TAG_TOGGLE_SWITCH="e:ToggleSwitch"
TAG_VSCROLLBAR="e:VScrollBar"
TAG_VSLIDER="e:VSlider"
TAG_GROUP="e:Group"
TAG_PANEL="e:Panel"
TAG_SCROLLER="e:Scroller"
TAG_VIEW_STACK="e:ViewStack"

def walk_eui(_dir):

	exmls = []
	for root, dirs, files in os.walk(_dir):
		for fileName in files:
			if fileName.endswith(".exml"):
				process_exml(os.path.join(_dir,fileName))
				exmls.append(os.path.join(_dir,fileName))
				pass
		pass
	pass

	process_thm(exmls)

def process_exml(_file):

	print("[***Debug***] begin process file (%s)..."%(_file))

	elements=[]
	tsName= os.path.basename(_file).rsplit('.')[0]+".ts"

	bs=BeautifulSoup(open(_file, 'r'))

	# fixme: 搜索所有需要使用的控件，以是否有 id 属性为准，后续需要增加功能处理id是否重复问题
	for tag in bs.find_all(lambda tag: tag.has_attr('id') and tag.name != "w:config" and (tag.parent.name != "e:skin" or (tag.parent.name =="e:skin" and tag.parent.parent.name == "[document]") )):
		if tag.has_attr('touchenabled') and tag['touchenabled'] == 'true':
			elements.append((tag['id'], tag.name, True))
		else:
			elements.append((tag['id'], tag.name, False))

	generate_asLayer(os.path.join(SRC_DIR, tsName), elements, _file)

	pass

def generate_asLayer(_tsFile, _elements, _exmlFile):

	if os.path.exists(_tsFile):
		print("[***Debug***] (%s) already existed, please modify manually! SKIP this one!!!!!"%(_tsFile))
		return

	print("[***Debug***] begin generate ts file (%s)..."%(_tsFile))

	tsContent = ""

	tsContent = tsContent + "// generated typescript file by expSkins.py.\n"
	tsContent = tsContent + "// should not modify this file!.\n"
	tsContent = tsContent + "// by ruix\n"

	tsContent = tsContent + "\n\nclass %s extends eui.Component implements  eui.UIComponent {\n\n"%(os.path.basename(_tsFile).rsplit('.')[0])

	# add member variables
	for element in _elements:
		(tagName, tagType, touchable) = element

		if tagType.lower() == TAG_BITMAP_LABEL.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_BITMAP_LABEL.split(':')[1])

		elif tagType.lower() == TAG_BUTTON.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_BUTTON.split(':')[1])

		elif tagType.lower() == TAG_CHECKBOX.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_CHECKBOX.split(':')[1])

		elif tagType.lower() == TAG_COMPONET.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_COMPONET.split(':')[1])

		elif tagType.lower() == TAG_DATAGROUP.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_DATAGROUP.split(':')[1])

		elif tagType.lower() == TAG_EDITABLE_TEXT.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_EDITABLE_TEXT.split(':')[1])

		elif tagType.lower() == TAG_HSCROLLBAR.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_HSCROLLBAR.split(':')[1])

		elif tagType.lower() == TAG_HSLIDER.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_HSLIDER.split(':')[1])

		elif tagType.lower() == TAG_IMAGE.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_IMAGE.split(':')[1])

		elif tagType.lower() == TAG_LABEL.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_LABEL.split(':')[1])

		elif tagType.lower() == TAG_LIST.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_LIST.split(':')[1])

		elif tagType.lower() == TAG_PROGRESS_BAR.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_PROGRESS_BAR.split(':')[1])

		elif tagType.lower() == TAG_RECT.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_RECT.split(':')[1])

		elif tagType.lower() == TAG_TABBAR.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_TABBAR.split(':')[1])

		elif tagType.lower() == TAG_TEXTINPUT.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_TEXTINPUT.split(':')[1])

		elif tagType.lower() == TAG_TOGGLE_BUTTON.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_TOGGLE_BUTTON.split(':')[1])

		elif tagType.lower() == TAG_TOGGLE_SWITCH.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_TOGGLE_SWITCH.split(':')[1])

		elif tagType.lower() == TAG_VSCROLLBAR.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_VSCROLLBAR.split(':')[1])

		elif tagType.lower() == TAG_VSLIDER.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_VSLIDER.split(':')[1])

		elif tagType.lower() == TAG_GROUP.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_GROUP.split(':')[1])

		elif tagType.lower() == TAG_PANEL.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_PANEL.split(':')[1])

		elif tagType.lower() == TAG_SCROLLER.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_SCROLLER.split(':')[1])

		elif tagType.lower() == TAG_VIEW_STACK.lower():
			tsContent = tsContent + "\tpublic %s : eui.%s;\n"%(tagName, TAG_VIEW_STACK.split(':')[1])
		pass

	tsContent = tsContent + "\n\n\tconstructor() {\n"
	tsContent = tsContent + "\t\tsuper();\n"
	tsContent = tsContent + "\t}\n\n"

	tsContent = tsContent + "\tprotected partAdded(partName:string,instance:any):void\n"
	tsContent = tsContent + "\t{\n"
	tsContent = tsContent + "\t\tsuper.partAdded(partName,instance);\n"
	tsContent = tsContent + "\t}\n\n\n"

	tsContent = tsContent + "\tprotected childrenCreated():void\n"
	tsContent = tsContent + "\t{\n"
	tsContent = tsContent + "\t\tsuper.childrenCreated();\n"
	tsContent = tsContent + "\t\tthis.bindTouchEvent();\n"
	tsContent = tsContent + "\t}\n\n\n"

	tsContent = tsContent + "\tprotected bindTouchEvent(): void{\n"

	# add event listener
	for element in _elements:
		(tagName, tagType, touchable) = element
		if touchable:
			tsContent = tsContent + "\t\tthis.%s.addEventListener(egret.TouchEvent.TOUCH_TAP, this.handleTouch,this);\n"%(tagName)

	tsContent = tsContent + "\t}\n\n\n"


	tsContent = tsContent + "\tprivate handleTouch(evt:egret.TouchEvent):void\n"
	tsContent = tsContent + "\t{\n"
	tsContent = tsContent + "\t\tswitch(evt.target) {\n"
	tsContent = tsContent + "\t\t\tdefault:\n"
	tsContent = tsContent + "\t\t\t\tbreak;\n"
	tsContent = tsContent + "\t\t}\n"
	tsContent = tsContent + "\t}\n"

	tsContent = tsContent + "}\n\n\n"

	f = open(_tsFile, 'w')
	f.write(tsContent)
	f.close()
	pass


def process_thm(_exmlFiles):
	print(_exmlFiles)

	f=open(THM_DIR,'r')
	js=json.load(f)
	for file in _exmlFiles:
		fn=os.path.basename(file)
		className=fn.rsplit('.')[0]
		if not className in js['skins']:
			js['skins'][className] = 'resource/eui_skins/%s'%(fn)
	pass
	f.close()
	
	f=open(THM_DIR, 'w')
	f.write(json.dumps(js, indent=4, ensure_ascii=False, sort_keys=True))
	f.close()

def main():
	print("[***Debug***] begin")
	walk_eui(EUI_DIR)

	print("[***Debug***] done!")
	pass

if __name__ == '__main__':
	main()
