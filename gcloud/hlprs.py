import datetime
import time
from django.utils.timezone import utc
import base64
import helpers

from PIL import Image


def timestamp():
    now = datetime.datetime.utcnow().replace(tzinfo=utc)
    return now


def timestamp_sec():
    now = timestamp()
    seconds = time.mktime(now.timetuple())
    return seconds


def generate_filename(filename_orig):
    try:
        return base64.b64encode(filename_orig)[6:] + str(timestamp_sec()) +\
            base64.b64encode(filename_orig)[:3]
    except:
        return str(timestamp_sec())


def resize_image(filename, ext):
    im = Image.open("/tmp/" + filename + ext)
    WIDTH_MAX = 1000
    HEIGHT_MAX = 1000
    if im.size[0] > WIDTH_MAX or im.size[0] > HEIGHT_MAX:
        im.thumbnail([WIDTH_MAX, HEIGHT_MAX], Image.ANTIALIAS)
        im.save("/tmp/" + filename + ".jpg")
        ext = ".jpg"
    else:
        im.save("/tmp/" + filename + ".jpg")
        ext = ".jpg"
    helpers.fs.resize_and_crop("/tmp/" + filename + ".jpg",
                               "/tmp/" + filename + ".jpg" + ".thumbnail.jpg",
                              (100, 100), 'middle', 100)
    return ext
