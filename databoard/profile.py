from inspector import Inspector
from processor import processor
import uuid
import time
import urllib


from datetime import datetime

from options import GlobalOptions
from list_processor import ListProcessor

def copykeys(source, dest, keys=None, default=None):
    for k in keys:
        dest[k] = source.get(k, default)

class DataProfile(object):
    def __init__(self, data, **kw):
        i = Inspector(data)
        self.data = data
        self.options = GlobalOptions(kw)
        self.data_class = kw.get("class", i.data_class())
        self.processors = processor.get_processors(self.data_class, exclude=kw.get("exclude", []),  include=kw.get("include", []))
        self.id = uuid.uuid1().hex
        self.name = i.name

    
    def processed_data(self):
        d = []
        type_processor = ListProcessor(self.data)
        for p in self.processors:
            func = getattr(type_processor, p['key'])
            meta = {}
            
            copykeys(p, meta, ['key', 'name', 'description', 'output'])
            
            meta['data'] = func()
            d.append(meta)
            
        return d
        
    def profile(self):
        return {
            'type': self.data_class,
            'id' : self.id,
            'data' : self.data,
            'processed_data': self.processed_data(),
            'timestamp': time.mktime(datetime.now().timetuple()),
            'name': self.name
        }