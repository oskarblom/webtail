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
    connected = str(app.connected_mode).lower()
    return render_template("index.html", connected=connected)

def tail(sock):
    #So we don't need to fiddle with lines and buffers
    for msg in sock.makefile():
        fan.fanout(msg)

def get_args()
    if not len(sys.argv) == 3:
        sys.stderr.write(
            "Warning: missing arguments. Starting in disconnected mode\n" +
            "Usage: python webtail.py remotehost port\n")
        return None, None

    return sys.argv[1:]

def get_sock(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.connect((host, port))

    return sock

if __name__ == "__main__":
    host, port = get_args()
    app.debug = True
    app.connected_mode = not host or not port
    try:
        if app.connected_mode:
            sock = get_sock(host, port)
            gevent.spawn(tail, sock)
        else:
            sock = None

        server = WSGIServer(("", 5000), app)
        server.serve_forever()
    except KeyboardInterrupt:
        if sock:
            sock.close()
        server.close()
