from gevent import monkey; monkey.patch_all()

import sys
from datetime import datetime

from flask import Flask, render_template
import gevent
from gevent import socket, backdoor
from gevent.wsgi import WSGIServer

from fan import Fan

app = Flask(__name__)
fan = Fan(app)

@app.route("/debug")
def debug():
    return "Currently %d subscriptions" % len(fan.subscriptions)

@app.route("/lastread")
def lastread():
    last_read = app.last_read if app.last_read else "never"
    return "Last read message was " + app.last_read

@app.route("/")
def index():
    connected = str(app.connected_mode).lower()
    return render_template("index.html", connected=connected)


def tail():
    while True:
        sock = None
        sockfile = None

        try:
            app.sock = sock = get_sock()
            sockfile = sock.makefile()

            while True:
                #So we don't need to frame our messages
                msg = sockfile.readline()
                if not msg:
                    app.logger.warn("Msg was empty. Server disconnected.")
                    break
                app.last_read = str(datetime.now())
                gevent.spawn(fan.fanout, msg)

        except socket.timeout:
            app.logger.warn("Socket timeout occured")
        except socket.error:
            app.logger.warn("Socket error occured")
        except Exception, e:
            app.logger.error("Error %r" % e)
        finally:
            if sock:
                sock.close()
            if sockfile:
                sockfile.close()

        gevent.sleep(5)

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
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
    #sock.settimeout(5)
    sock.connect((app.remote_host, app.remote_port))

    return sock

if __name__ == "__main__":
    host, port = get_args()
    app.debug = True
    app.connected_mode = True if host and port else False
    app.sock = None
    app.last_read = None
    try:
        if app.connected_mode:
            app.remote_host = host
            app.remote_port = port
            app.tail = gevent.spawn(tail)
            manhole = backdoor.BackdoorServer(("127.0.0.1", 1337),
                                              locals={"app": app})
            manhole.start()

        server = WSGIServer(("", 5000), app)
        server.serve_forever()
    except KeyboardInterrupt:
        if app.sock:
            app.sock.close()
        manhole.close()
        server.close()
