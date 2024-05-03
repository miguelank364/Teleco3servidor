#!/usr/bin/python
import sys
import logging

sys.path.insert(0,"/var/www/webapp/")
from web.views import app as application
