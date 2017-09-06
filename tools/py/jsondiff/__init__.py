__version__ = '0.0.1'
import sys

if sys.version_info[0] > 2:
    from jsondiff.jsondiff import jdiff
else:
    from jsondiff import jdiff

def diff(left,right,with_values=False):
    _diff = jdiff(left, right, with_values)
    return _diff.difference