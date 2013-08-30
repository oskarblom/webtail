from flask import Response
from gevent.queue import Queue

# https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events
class ServerSentEvent(object):

    def __init__(self, data):
        self.data = data
        self.event = None
        self.id = None
        self.desc_map = {
            self.data : "data",
            self.event : "event",
            self.id : "id"
        }

    def encode(self):
        if not self.data:
            return ""

        lines = ["%s: %s" % (v, k) for k, v in self.desc_map.iteritems() if k]

        return "%s\n\n" % "\n".join(lines)

class Fan(object):

    def __init__(self, app):
        self.app = app
        self.subscriptions = []

        def subscribe():
            def gen():
                q = Queue()
                self.subscriptions.append(q)
                try:
                    while True:
                        data = q.get()
                        yield data
                except GeneratorExit:
                    self.subscriptions.remove(q)

            return Response(gen(), mimetype="text/event-stream")

        self.app.route("/subscribe")(subscribe)

    def fanout(self, data):
        msg = ServerSentEvent(data).encode()
        for sub in self.subscriptions[:]:
            sub.put(msg)
