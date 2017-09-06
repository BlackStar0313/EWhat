import os
import re
import codecs

def replace(_ts):
    s=codecs.open(_ts, 'r', 'utf-8').read()
    ns=re.sub(r'(asTextManager.format\( *)([a-zA-Z0-9\._]+|\'[^\']+\'|\"[^\"]+\")( *, *)', r'\2.format(', s)

    ns=re.sub(r'(asTextManager.format\( *)([a-zA-Z0-9\._]+|\'[^\']+\'|\"[^\"]+\")( *\))', r'\2', ns)    
    with codecs.open(_ts, 'w', 'utf-8') as f: f.write(ns)

def main():
    for root, dirs, files in os.walk("../../three_country/src/"):
        for fn in files:
            if fn.endswith('.ts'):
                replace(os.path.join(root, fn))
                pass

if __name__ == '__main__':
   main()
