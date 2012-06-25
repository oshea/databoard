from board import Board
from dataclass import DataClass


data = [1,2,4,5,6,7,7,8,6,4,5]
board = Board()
profile = board.add(data)
print profile.data_class
