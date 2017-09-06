#-----------------------------------------------------------------------------
# Copyright (c) 2016 Rui Xie xrdavies@gmail.com
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#-----------------------------------------------------------------------------
# ''' 
# jsondiff is a simple tool to compare json objects with values or without values.
# The source code is based on jscompare by https://github.com/monsur/jsoncompare whose core part is based on http://djangosnippets.org/snippets/2247/
# with modification to be easier to be used by other developers.
# For complex compare of json files, please refer other tools such as:
# https://github.com/bazaarvoice/json-regex-difftool
# https://github.com/ZoomerAnalytics/jsondiff
# '''

import json
import sys
import types

TYPE = 'TYPE'
PATH_DELETE = 'DISCARD'
PATH_ADD = 'ADD'
VALUE = 'VALUE'

class jdiff(object):
    def __init__(self,left, right, with_values=False):
        self.difference = []
        self.check(left, right, with_values=with_values)

        self.check(right, left, with_values=with_values, versa=True)

    def check(self, left, right, path='', with_values=False, versa=False):
        if with_values and right != None:
            if not isinstance(left, type(right)):
                if versa:
                    # message = '%s - %s, %s' % (path, type(right).__name__, type(left).__name__)
                    # self.save_diff(message, TYPE)
                    pass
                else:
                    message = '%s - %s, %s' % (path, type(left).__name__, type(right).__name__)
                    self.save_diff(message, TYPE)

        if isinstance(left, dict):
            for key in left:
                # the left part of path must not have trailing dot.
                if len(path) == 0:
                    new_path = key
                else:
                    new_path = '%s.%s' % (path, key)

                if isinstance(right, dict):
                    if key in right:
                        sec = right[key]
                    else:
                        #there are key in the left, that is not presented in the right
                        if versa:
                            message = '%s | %s'%(path, new_path)
                            self.save_diff(message, PATH_ADD)
                        else:
                            message = '%s | %s'%(new_path, path)
                            self.save_diff(message, PATH_DELETE)

                        # prevent further values checking.
                        sec = None

                    # recursive call
                    if sec != None:
                        self.check(left[key], sec, path=new_path, with_values=with_values, versa=versa)
                else:
                    # right is not dict. every key from left goes to the difference
                    if versa:
                        message = '%s | %s'%(path, new_path)
                        self.save_diff(message, PATH_ADD)
                        self.check(left[key], right, path=new_path, with_values=with_values, versa=versa)
                    else:
                        message = '%s | %s'%(new_path, path)
                        self.save_diff(message, PATH_DELETE)
                        self.check(left[key], right, path=new_path, with_values=with_values, versa=versa)

        # if object is list, loop over it and check.
        elif isinstance(left, list):
            for (index, item) in enumerate(left):
                new_path = '%s[%s]' % (path, index)
                # try to get the same index from right
                sec = None
                if right != None:
                    try:
                        sec = right[index]
                    except (IndexError, KeyError):
                        # goes to difference
                        if versa:
                            # message = '%s - %s' % (new_path, type(item).__name__)
                            # self.save_diff(message, TYPE)
                            pass
                        else:
                            message = '%s - %s' % (new_path, type(item).__name__)
                            self.save_diff(message, TYPE)

                # recursive call
                self.check(left[index], sec, path=new_path, with_values=with_values)
        # not list, not dict. check for equality (only if with_values is True) and return.
        else:
            if with_values and right != None:
                if left != right:
                    if versa:
                        # message = '%s - %s | %s' % (path, right, left)
                        # self.save_diff(message, VALUE)
                        pass
                    else:
                        message = '%s - %s | %s' % (path, left, right)
                        self.save_diff(message, VALUE)
            return

    def save_diff(self, diff_message, type_):
        if diff_message not in self.difference:
            self.difference.append((type_, diff_message))
