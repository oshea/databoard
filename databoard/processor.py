import yaml
import os

class Processor(object):
    def __init__(self):
        self.load_processors()
            
    def get_processors(self, data_type, exclude=[], include=[]):
        processors = []
        for p in self.processors_by_type.get(data_type, []):
            if exclude.count(p['key']) == 0:
                processors.append(p)   
        print "Processors:"
        print processors
        return processors
         
    def create_processor(self, processor):
        processor["func"] = getattr(self, processor["type"] + "_" + processor["key"])
        return processor

    def load_processors(self):
        config_file = os.path.join(os.path.dirname(__file__), "config/processors.yaml")
        config = open(config_file, 'r')
        self.processors = yaml.load(config)
        config.close()
        
        print self.processors
        
        self.processors_by_type = {}
        for pi in self.processors:
            for k, p in pi.items(): 
                p['key'] = k
                self.processors_by_type.setdefault(p["input"], [])
                self.processors_by_type[p["input"]].append(p)
    

processor = Processor()