Webtail
=======

Fairly simple multiuser realtime webapp for tailing logs over the network.

## Requirements

* [Python](http://python.org/) >) 2.6
* [Gevent](http://www.gevent.org/) >= 1.0
* [Flask](http://flask.pocoo.org/)

## Installation

### Easy way:
    $ pip install -r requirements.txt

### Harder way:
Install requirements manually 

If you run into any problems. Consult one of the links in the requirements
section. Note that gevent requires [libev]
(http://software.schmorp.de/pkg/libev.html).


## Usage

Open up a port for listening on the remote machine and pour
stuff into the socket. Probably something like this:

1. On your server: `$ tail -f mylogfile.txt | netcat -l -k 6565`
2. Start the webapp with `$ python webtail.py yourserverhost 6565`
3. Visit http://localhost:5000 in your browser

