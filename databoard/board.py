import webbrowser

from profile import DataProfile

class Board(object):
    def __init__(self, data=None):
        self.history = []
        
        if data: self.add(data)
        self.open_board()
        
    def open_board(self):
        url = "http://www.google.com"
        webbrowser.open_new(url)
        
    def add(self, data):
        profile = DataProfile(data)
        self.history.append(profile)
        return profile
        
        
        
    