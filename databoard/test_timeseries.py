from board import Board
from datetime import datetime

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
while len(data) < 1:
    d = {}
    d['timestamp'] = datetime.now()
    d['value'] = normvariate3()
    data.append(d)
    
board = Board()
profile = board.add(data)