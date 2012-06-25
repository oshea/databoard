from dataclass import DataClass

class Inspector(object):
    def __init__(self, data):
        if data:
            self.data = data
            self.identity = self.identify(self.data)
        
    def identify(self, data):
        identity = None
        if isinstance(self.data, list):
            identity = DataClass.LIST
            
        return identity
            
    def data_class(self):
        return self.identity
            