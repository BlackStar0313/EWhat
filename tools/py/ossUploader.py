# -*- coding:utf-8 -*-
# Author: ruix
# OSS uploader
# This script will clean the folder on OSS to ensure all objects are align with uploaded ones.

__name__ = 'ossUploader'
__author__ = 'ruix'

import sys
import optparse
import oss2
import os

ACCESS_KEY='LTAIICOA0N6FUHmC'
SECRET_KEY='gqj4qskHbE1sUGjgb7gWlXOZ857S8s'
ENDPOINT='http://oss-cn-shanghai.aliyuncs.com'

def getBucket(access_key, secret_key, endpoint, bucketName):
    auth = oss2.Auth(access_key, secret_key)
    service = oss2.Service(auth, endpoint)
    bucket = oss2.Bucket(auth, endpoint, bucketName)
    return bucket

def upload(_path, _folder, _bucket):
    print('[***Debug***] Begin to upload [%s] to [%s]...'%(_path, _folder))

    if os.path.isdir(_path):
        print('[***Debug***] Clear folder [%s]...'%(_folder))
        for b in oss2.ObjectIterator(_bucket):
            if b.key.startswith(_folder):
                print('[***Debug***] deleting [%s]'%(b.key))
                _bucket.delete_object(b.key)

        for root, _, files in os.walk(_path):
            for file in files:
                if not file.startswith("."):
                    bPath=os.path.join(_folder, os.path.join(root, file).replace(_path,'',1))
                    sPath=os.path.join(root, file)
                    print('[***Debug***] Put [%s] to [%s] in OSS'%(file, bPath))
                    _bucket.put_object_from_file(bPath, sPath)
    else:
        bPath = os.path.join(_folder, os.path.basename(_path))
        for b in oss2.ObjectIterator(_bucket):
            if b.key.startswith(bPath):
                _bucket.delete_object(b.key)

        print('[***Debug***] Put [%s] to [%s] in OSS'%(bPath, _path))
        _bucket.put_object_from_file(bPath, _path)
    pass

def main():
    
    opt=optparse.OptionParser("usage%prog -b <bucket> -d <folder> -f <source path>")
    opt.add_option('-b', dest='bucket', type='string', help="specify bucket name")
    opt.add_option('-d', dest='folder', type='string', help="specify folder name")
    opt.add_option('-f', dest='path', type='string', help="specify the path/file to upload")

    (option, args) = opt.parse_args()

    if option.path == None or option.bucket == None or option.folder == None:
        opt.print_help()
    else:
        # path='/Volumes/HD/Development/h5_games/sanguo/tools/bin/0.9.4/'
        # bucketName='h5small'
        # folder='sanguo'

        path = option.path
        bucketName = option.bucket
        folder = option.folder

        print(path, bucketName, folder)

        bucket = getBucket(ACCESS_KEY, SECRET_KEY, ENDPOINT, bucketName)
        upload(path, folder, bucket)

# fixme: 不知道为啥 __name__ 不等于__main__
sys.exit(int(main() or 0))
