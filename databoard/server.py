import os

import tornado.ioloop
import tornado.web


global waiting_requests
waiting_requests = []

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "web/static"),
    "debug": True
}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("web/databoard.html")
        
class DataHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self, last_id=None):
        print 'waiting for data'
        waiting_requests.append(self.send_data)
        
    def send_data(self, data):
        self.write(data)
        self.finish()
        
    def post(self):
        self.write("WE GOT YOUR DATA")
        while len(waiting_requests) > 0:
            cb = waiting_requests.pop()
            #cb(self.get_argument('profile'))
            #print self.get_argument('profile')
            cb(self.get_argument('profile'))
            

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/data", DataHandler),
], **settings)

if __name__ == "__main__":
    DATABOARD_PORT = 8888
    
    try:
        application.listen(DATABOARD_PORT)
        tornado.ioloop.IOLoop.instance().start()
    except:
        print 'Web server failed to start'