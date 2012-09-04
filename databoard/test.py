from board import Board
from dataclass import DataClass

import random

def normvariate1():
    return int(random.normalvariate(2000, 40))
    
def normvariate2():
    return int(random.normalvariate(20, 1))
    
    
def normvariate3():
    return int(random.normalvariate(400, 6))

def randint():
    return random.randint(0, 40)
    
data = []
funcs = []
funcs.append(normvariate1)
funcs.append(normvariate2)
funcs.append(normvariate3)
funcs.append(randint)


func = random.choice(funcs)
while len(data) < 10000:
    data.append(func())
    
board = Board()
profile = board.add(data)
print profile.data_class
