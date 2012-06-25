from inspector import Inspector

class DataProfile(object):
    def __init__(self, data):
        self.data = data
        i = Inspector(data)
        self.data_class = i.data_class()
        
    def to_json(self):
        return {}