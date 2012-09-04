
class GlobalOptions(object):
    def __init__(self, overrides={}):
        self.options = {} # Load from config file
        self.options.update(overrides)