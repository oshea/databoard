import signal
import os
import sys
import exceptions

class ExitException(exceptions.BaseException):
    pass

class Shell(object):
    def __init__(self):
        signal.signal(signal.SIGINT, self.sigint_handler)
        self.py = PythonHandler()
        
    def run(self):
        while True:
            try:
                cmd = raw_input(self.prompt())
                self.input_handler(cmd)
                
            except ExitException:
                return 0;
            
            
        
    def prompt(self):
        return "{0} >> ".format(os.getlogin())
        
    def input_handler(self, cmd):
        
        if cmd == 'exit':
            raise ExitException
        elif len(cmd) == 0:
            pass
        else:
            #TODO add session handling
            response = self.py.run(1, cmd)
            if response != None:
                print response
        
    def sigint_handler(self):
        pass
        

class PythonHandler(object):
    def __init__(self):
        pass
        
    def handle(self, session_id, cmd):
        try: 
            val = eval(cmd)
            return str(val)
        except: pass
        
        try:
            exec(cmd)
            print 'ran ' + cmd + ' through exec' 
        except Exception as e:
            return str(e)
            
        return None
        
    def run(self, session_id, statement):
        if not statement:
          return

        # the python compiler doesn't like network line endings
        statement = statement.replace('\r\n', '\n')

        # add a couple newlines at the end of the statement. this makes
        # single-line expressions such as 'class Foo: pass' evaluate happily.
        statement += '\n\n'

        # log and compile the statement up front
        try:
            logging.info('Compiling and evaluating:\n%s' % statement)
            compiled = compile(statement, '<string>', 'single')
        except:
            return traceback.format_exc()
          
         # create a dedicated module to be used as this statement's __main__
        statement_module = new.module('__main__')

         # use this request's __builtin__, since it changes on each request.
         # this is needed for import statements, among other things.
        import __builtin__
        statement_module.__builtins__ = __builtin__

        # load the session from the datastore
        session = Session.get(self.request.get('session'))

         # swap in our custom module for __main__. then unpickle the session
         # globals, run the statement, and re-pickle the session globals, all
         # inside it.
        old_main = sys.modules.get('__main__')
        try:
            sys.modules['__main__'] = statement_module
            statement_module.__name__ = '__main__'

            # re-evaluate the unpicklables
            for code in session.unpicklables:
                exec code in statement_module.__dict__

            # re-initialize the globals
            for name, val in session.globals_dict().items():
                try:
                    statement_module.__dict__[name] = val
                except:
                    msg = 'Dropping %s since it could not be unpickled.\n' % name
                    self.response.out.write(msg)
                    logging.warning(msg + traceback.format_exc())
                    session.remove_global(name)

            # run!
            old_globals = dict(statement_module.__dict__)
            try:
                old_stdout = sys.stdout
                old_stderr = sys.stderr
                try:
                    sys.stdout = self.response.out
                    sys.stderr = self.response.out
                    exec compiled in statement_module.__dict__
                finally:
                    sys.stdout = old_stdout
                    sys.stderr = old_stderr
            except:
                self.response.out.write(traceback.format_exc())
                return
        
        
        
if __name__ == '__main__':
    sys.exit(Shell().run())