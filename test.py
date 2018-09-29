from byteplay import *
from pprint import pprint

def main():
    a = 1
    b = 2

    print a + b

class Cat:
    def say(self, word):
        print self.phrase(), word

    def phrase(self):
        return "Meow, "


cat = Cat()
cat.say("hello")

c = Code.from_code(main.func_code)
pprint(c.code)