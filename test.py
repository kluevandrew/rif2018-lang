from byteplay import *
from pprint import pprint

def main():
    a = 1
    b = 2

    print a + b


c = Code.from_code(main.func_code)
pprint(c.code)