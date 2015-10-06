import datetime
from django.utils.timezone import utc
import time
import dateutil.parser


def timestamp():
    now = datetime.datetime.utcnow().replace(tzinfo=utc)
    return now


def add_days_to_date(date, days):
    return date + datetime.timedelta(days=days)


def rm_days_from_date(date, days):
    return date - datetime.timedelta(days=days)


def timestamp_sec():
    now = timestamp()
    seconds = time.mktime(now.timetuple())
    return seconds * 1000


def datetime_to_timestamp(date):
    seconds = time.mktime(date.timetuple())
    return seconds * 1000


def timestamp_to_datetime(date_str):
    return dateutil.parser.parse(date_str)
