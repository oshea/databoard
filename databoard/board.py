import webbrowser
import subprocess
import os
import json

from os import path

import requests

from profile import DataProfile
from dataclass import *

DATABOARD_PORT = 8888



def add(data, **kw):
    board = Board()
    board.add(data, **kw)
    return board
    
def timeseries(data, **kw):
    kw['class'] = DataClass.TIMESERIES
    return add(data, **kw)


class Board(object):
    def __init__(self, data=None):
        self.history = []
        
        if not self.is_running():
            print 'Starting Server'
            self.server = self.start_server()
            print 'Opening Board'
            self.open_board()
            
        if data: self.add(data)
        
       
    def is_running(self):
        request = requests.get("http://127.0.0.1:{0}".format(DATABOARD_PORT), config={'safe_mode':True})
        return request.status_code == 200
            
 
    def open_board(self):
        url = "http://127.0.0.1:{0}".format(DATABOARD_PORT)
        webbrowser.open_new(url)
        
        
    def send_data(self, data_profile):
        print 'Sending Data'
        p = data_profile.profile()
        print p
        counter = 0
        request = None
        while counter < 25:
            try: request = requests.post("http://127.0.0.1:{0}/data".format(DATABOARD_PORT), data={'profile':json.dumps(p)})
            except: 
                counter += 1
            break

        if request:
            print "RESPONSE:"
            print request.text


    def start_server(self):
        server_path = path.join(path.split(path.abspath(__file__))[0], 'server.py')
        print "SERVER PATH:"
        print server_path
        devnull = open(os.devnull, 'w') 
        server = subprocess.Popen(['python', '{0}'.format(server_path), str(DATABOARD_PORT)], shell=False, stdin=devnull , stdout=devnull, stderr=devnull)
        # server = subprocess.Popen(['python', '{0}'.format(server_path), str(DATABOARD_PORT)], shell=False)
        return server
        
        

    def add(self, data, **kw):
        profile = DataProfile(data, **kw)
        self.history.append(profile)
        self.send_data(profile)
        return profile
        
        
        
    