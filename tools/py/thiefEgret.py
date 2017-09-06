# -*- coding:utf-8 -*-
__author__ = 'xrdavies'

import io
import requests
import json
import urlparse
import os
import posixpath

def fileName(_uri):
	return os.path.basename(urlparse.urlparse(_uri)[2])

def filePath(_uri):
	arr = urlparse.urlparse(_uri)
	uri = urlparse.urlunparse((arr.scheme, arr.netloc, posixpath.normpath(arr[2]), arr.params, arr.query, arr.fragment))
	arr = uri.rsplit('/', 1)
	ret = ''
	if len(arr)>1:
		ret = uri.rsplit('/', 1)[0]
	return ret

class ThiefEgret(object):
	"""docstring for Thief"""
	def __init__(self, _res_url, _output_path):
		super(Thief, self).__init__()
		self.res_url = _res_url
		self.res_base_url = filePath(_res_url)
		self.output_path = _output_path
		self.ss = requests.session()
		self.res = {}

	def dump(self):
		print('[***Debug***] Begin to fetch resources in (%s)...'%(self.res_url))
		print('[***Debug***] base url is (%s)'%(self.res_base_url))
		print('[***Debug***] output path is (%s)'%(self.output_path))

		if not os.path.exists(self.output_path):
			print('[***Debug***] output path is not existsed. Create it...')
			os.makedirs(self.output_path)
			pass

		self.__fetch_res_json()
		pass

	def __fetch_res_json(self):
		resp = self.ss.get(self.res_url)
		if resp.status_code == 200:
			tempStorage = io.BytesIO()
			for b in resp.iter_content(1024):
				tempStorage.write(b)

			fName = fileName(self.res_url)
			with open(os.path.join(self.output_path, fName), 'wb') as f: f.write(tempStorage.getvalue())

			self.res = json.loads(open('default.res.json', 'r').read())

			for x in self.res['resources']:
				if 'url' not in x:
					print('[***Error***] item url not existed!! ', x)
					continue
					pass
				self.__fetch_item(x['url'])
				pass
		else:
			print('[***Error***] fetch (%s) failed. Error (%s)'%(self.res_url, resp.content))
			exit(1)

		pass

	def __fetch_item(self, _item):
		u = urlparse.urljoin(self.res_url, _item)
		print('[***Debug***] fetch item (%s)...'%(u))

		fName = fileName(_item)
		p = _item.split('/', 1)
		fDir = ''
		if len(p) > 1:
			fDir = os.path.join(self.output_path, p[0])
		else:
			fDir = self.output_path

		if not os.path.exists(fDir):
			print('[***Debug***] dir (%s) not existed. Create it...'%(fDir))
			os.makedirs(fDir)
			pass

		resp = self.ss.get(u)
		if resp.status_code == 200:
			tempStorage = io.BytesIO()
			for b in resp.iter_content(1024):
				tempStorage.write(b)
			with open(os.path.join(fDir, fName), 'wb') as f: f.write(tempStorage.getvalue())
		else:
			print('[***Error***] fetch item (%s) failed.'%(u))
		pass

def main():
	thief = ThiefEgret('http://pirate-h5.hortor002.com/pirate/resource/default.res.json', 'thief')
	thief.dump()
	pass

if __name__ == '__main__':
	main()


		