import math
import numpy as np
__global_variable_values = {}



__global_variable_table = {}
__global_function_params = {
    "load": 2,
    "dist": 4,
    "diff": 2,
    "add":2,
    "square": 1,
    "root": 1,
    "check": 10,
    "absDiff": 2,
    "gt": 2,
    "lt": 2,
    "gte": 2,
    "lte": 2,
    "eq": 2,
    "ath": 4,
    "atv": 4,
    "calcAngle": 2,
    "rad": 1,
    "print": 1,
    "if":3,
    "and":2,
    "or": 2,
    "puts": 2,
    "divide":2,
    "multiply":2,
    "angleScore":3,
    "distScore":2,
    "avg":2,
    "gtScore":2,
    "ltScore":2,
    "not":1,
    "angle3": 6,
    "concat":3,
    "sum":2,
    "concat2":2,
}
__tokens = {
    "@": "function",
    "!": "value",
    "&": "variable",
}


def __internal_print(val, state):
    print("(Debug Print) %s" % val)

def diff(val1, val2, state):
    return val1 - val2

def _sum(val1, val2, state):
    return val1 + val2

def square(val, state):
    return val**2

def root(val, state):
    return val**0.5

def absDiff(val1, val2, state):
    return abs(val1-val2)

def gt(val, limit, state):
    return val>limit

def lt(val, limit, state):
    return val<limit

def gte(val, limit, state):
    return val>=limit

def lte(val, limit, state):
    return val<=limit

def calcAngle(opp, adj, state):
    return math.atan(opp/adj)

def radToDeg(val, state):
    return val * 180 / math.pi

def eq(val, limit, state):
    return val==limit

def dist(x1,x2,y1,y2, state):
    return ((x2-x1)**2 + (y2-y1)**2)**0.5

def angleToHori(x1,x2,y1,y2, state):
    return radToDeg(math.atan(abs(y2-y1)/abs(x2-x1)), state)

def angleToVert(x1,x2,y1,y2, state):
    return radToDeg(math.atan(abs(x2-x1)/abs(y2-y1)), state)

def _if(boolean, trueValue, falseValue, state):
    return trueValue if boolean else falseValue

def load(varName, val, state):
    if varName in state.keys():
        return
    __global_variable_table[varName] = val
def _and(b1,b2, state):
    return b1 and b2
def _or(b1, b2, state):
    return b1 or b2
def divide(val1, val2, state):
    return val1/val2
def multiply(val1,val2,state):
    return val1 * val2
def avg(val1, val2, state):
    return (val1+val2)/2
def angleScoreCalc(angle, idealAngle, halfRange,state):
    diff = 10/halfRange * abs(idealAngle - angle)
    return round((idealAngle-diff)/idealAngle * 100,0)
def distScoreCalc(dist, refDist, state):
    return round((refDist-dist)/refDist * 100,0)
def gtScoreCalc(val1, val2, state):
    if val2>val1:
        if (val2-val1)<val2:
            return round((val2 - abs(val1-val2))/val2 * 100,0)
        else:
            return round((val2-val1)/(val1+val2) * 100,0)
    else:
        return 100.0
def ltScoreCalc(val1, val2, state):
    if val2<val1:
        if (val1-val2)<val2:
            return round((val2 - abs(val1-val2))/val2 * 100,0)
        else:
            return round((val1-val2)/(val1+val2) * 100,0)
    else:
        return 100.0 #val1<val2
def _not(val, state):
    return not val
def concatenate(val1,val2,val3,state):
    return str(val1) + " " + str(val2) + " " + str(val3)
def concatenate2(val1,val2,state):
    return str(val1) + " " + str(val2)

def angleBetweenThreePoints(x1,x2,x3,y1,y2,y3,state):
    #finds angle at middle point
    dist12 = ((x2-x1)**2 + (y2-y1)**2)**0.5
    dist23 = ((x2-x3)**2 + (y2-y3)**2)**0.5
    dist13 = ((x3-x1)**2 + (y3-y1)**2)**0.5
    return radToDeg(math.acos((-dist13**2+dist23**2+dist12**2)/(2*dist23*dist12)), state)

def puts(varName, value, state):
    state["self"].__internals__['output'][varName] =  value
    return

__functions_register = {
    'load': load,
    'dist': dist,
    "print": __internal_print,
    "eq": eq,
    "atv":angleToVert,
    "ath":angleToHori,
    "rad":radToDeg,
    "calcAngle":calcAngle,
    "lte":lte,
    "gte":gte,
    "lt":lt,
    "gt":gt,
    "absDiff":absDiff,
    "root":root,
    "sq":square,
    "sum":_sum,
    "diff":diff,
    "if":_if,
    "and":_and,
    "or": _or,
    "puts": puts,
    "divide":divide,
    "multiply":multiply,
    "angleScore":angleScoreCalc,
    "distScore":distScoreCalc,
    "avg":avg,
    "gtScore":gtScoreCalc,
    "ltScore":ltScoreCalc,
    "not":_not,
    "angle3":angleBetweenThreePoints,
    "concat":concatenate,
    "concat2":concatenate2,
}
cursor = 0

def parseString(tokens, t):
        count = 0
        start = ""
        for i in range(t, len(tokens)):
            if start!="":
                if tokens[i][-1] == start:
                    tokens[count] = " ".join(tokens[count:i+1]) + "s"
                    return tokens[:count+1] + tokens[i+1:]
            if tokens[i][0] == "!":
                if tokens[i][1] == '"' or tokens[i][1] == "'":
                    start = tokens[i][1]
                    count = i

        return tokens


def parseFile(filepath, state, dir = 'exercises/'):
    global cursor

    fileContents = list()
    with open(dir + filepath + '.mff') as f:
        fileContents = list(filter(lambda i: i!="", f.read().split("\n")))

    for line in fileContents:
        cursor = 0
        tokens = list(filter(lambda i: i!="", line.strip().split(" ")))
        tokens = list(map(lambda i: i.strip(), tokens))
        if "'" in line or '"' in line:
            t = 0
            while t < len(tokens):
                tokens= parseString(tokens, t)
                t+=1


        assert tokens[0][0] == "@"
        res = parseToken(tokens[0][1:], "function", tokens[1:], state)
        #print("%s \n(Output) %s " % (line, res) if res else "%s " % (line))




def parseToken(name, type, tokens, state = {}):
    global cursor
    if type == 'function':
        params = __global_function_params[name]
        vals = []
        for i in range(params):
            if tokens[cursor + i][0] in __tokens.keys():
                vals.append(parseToken(tokens[cursor + i][1:], __tokens[tokens[cursor + i][0]], tokens[i+1:], state))
        cursor+=params
        return __functions_register[name](*vals, state)

    if type == 'variable':
        if "[" in name:
            indices = name.split("[")[1:]
            name = name.split("[")[0]
            indices = list(map(lambda i: i[:-1], indices))
            val = __global_variable_table[name] if not name in state.keys() else state[name]
            for i in range(len(indices)):

                val = val[int(indices[i])] if not indices[i][0] == '&' else val[__global_variable_table[indices[i][1:]]]
            return val
        if name=="self" and not name in __global_variable_table.keys():
            raise Error(12)
        return __global_variable_table[name] if not name in state.keys() else state[name]
    if type == 'value':
        val_type = name[-1]
        if val_type == "f":
            return float(name[:-1])
        if val_type == "i":
            return int(name[:-1])
        if val_type == "s":
            if name[-2] == '"' or name[-2]== "'":
                return str(name[1:-2])
            return str(name[:-1])



class Engine:
    def __init__(self, name):
        self.name = name
        self.__internals__ = {}
        self.__internals__["state"] = dict()
        self.__internals__["state"]["self"] = self
        self.__internals__["output"] = dict()

    def update(self, state):
        self.__internals__["state"] = dict(state)
        self.__internals__["output"] = dict()

    def __setitem__(self, index, val):
        self.__internals__["state"][index] = val

    def __getitem__(self, index):
        return self.__internals__["state"][index]

    def output_dict(self):
        return self.__internals__['output']

    def run(self, filename, dir = 'exercises/'):
        parseFile(filename, self.__internals__["state"], dir)
