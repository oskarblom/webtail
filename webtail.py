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

def tail():
    try:
        app.sock = sock = get_sock()

        #So we don't need to frame our messages
        for msg in sock.makefile():
            fan.fanout(msg)

        app.logger.warn("Server disconnected. Retrying in 5 seconds.")

    except socket.error:
        app.logger.warn("Unable to connect to server. Retrying in 5 seconds.")

    gevent.spawn_later(5, tail)

def get_args():
    if not len(sys.argv) == 3:
        sys.stderr.write(
            "Warning: missing arguments. Starting in disconnected mode\n" +
            "Usage: python webtail.py remotehost port\n")
        return None, None

    return sys.argv[1:]

def get_sock():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.connect((app.remote_host, app.remote_port))

    return sock

if __name__ == "__main__":
    host, port = get_args()
    app.debug = True
    app.connected_mode = True if host and port else False
    try:
        if app.connected_mode:
            app.remote_host = host
            app.remote_port = port
            gevent.spawn(tail)

        server = WSGIServer(("", 5000), app)
        server.serve_forever()
    except KeyboardInterrupt:
        if app.sock:
            app.sock.close()
        server.close()
