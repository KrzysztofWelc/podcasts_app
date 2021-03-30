#!/usr/bin/python3.6

import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/home/epi/18_welc/podcasts_app/')

from app import create_app
application = create_app()
