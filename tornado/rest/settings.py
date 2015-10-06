import os

SERVER = os.environ.get('SERVER', None)
MAIN_SERVER = os.environ.get('MAIN_SERVER', None)


if SERVER == 'localhost':
    PARENT_DOMAIN = 'http://localhost:8000'
else:
    PARENT_DOMAIN = 'http://146.148.127.101'
if MAIN_SERVER:
    PARENT_DOMAIN = MAIN_SERVER

HERMES_API_KEY = "5576fac672baa94327b8dbe3-5576fac672baa94327b8dbe2"
MONGODB_URL = "mongodb://kirill:msf1990@ds055680.mongolab.com:55680/db_1"
