Webtail
=======

Fairly simple realtime webapp for tailing logs over the network.

## Installation

### Prerequisites

### Installing

## Usage

Open up a port for listening on the remote machine and pour
stuff into the socket. Probably something like this:

1. On your server: $ tail -f mylogfile.txt | netcat -l 6565
2. Start the webapp with $ python webtail.py remotehost 6565 
3. Visit http://localhost:5000 in your browser
