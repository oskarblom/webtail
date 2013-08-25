from gevent import monkey; monkey.patch_all()

import sys

from flask import Flask, render_template
import gevent
from gevent import socket
from gevent.wsgi import WSGIServer

from fan import Fan

app = Flask(__name__)
fan = Fan(app)

@app.route("/debug")
def debug():
    return "Currently %d subscriptions" % len(fan.subscriptions)

@app.route("/")
def index():
    return render_template("index.html")

def tail(sock):
    for msg in sock.makefile():
        fan.fanout(msg)

if __name__ == "__main__":
    debug = True
    if not len(sys.argv) == 3:
        sys.stderr.write("Error: missing arguments\n")
        sys.stderr.write("Usage: python webtail.py remotehost port\n")
        exit(1)

    host, port = sys.argv[1:]

    try:
        if not debug:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.connect((host, port))

            gevent.spawn(tail, sock)
        else:
            sock = None

        app.debug = True
        server = WSGIServer(("", 5000), app)
        server.serve_forever()
    except KeyboardInterrupt:
        if sock:
            sock.close()
        if server:
            server.close()
