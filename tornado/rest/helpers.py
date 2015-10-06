import mongoengine
import settings
import requests
from datetime import datetime
from bson import json_util
from django.utils.timezone import utc
import time


def mongo_to_dict_helper(obj):
    return_data = []
    for field_name in obj._fields:
        if field_name in ("id",):
            oid = getattr(obj, field_name)
            return_data.append(("pk", str(oid)))
            continue

        data = obj._data[field_name]

        if isinstance(obj._fields[field_name], mongoengine.StringField):
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.FloatField):
            return_data.append((field_name, float(data)))
        elif isinstance(obj._fields[field_name], mongoengine.IntField):
            return_data.append((field_name, int(data)))
        elif isinstance(obj._fields[field_name], mongoengine.ListField):
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.DateTimeField):
            date = getattr(obj, field_name)
            date = json_util.dumps(date)
            return_data.append((field_name, eval(date)))
        elif isinstance(obj._fields[field_name], mongoengine.BooleanField):
            data = getattr(obj, field_name)
            data = json_util.dumps(data)

            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.DictField):
            return_data.append(getattr(obj, field_name))

    return dict(return_data)


def mongo_to_dict_helper2(obj, fields=None):
    return_data = []
    if fields:
        for field_name in fields:

            data = obj._data[field_name]

            if isinstance(obj._fields[field_name], mongoengine.StringField):
                return_data.append((field_name, data))
            elif isinstance(obj._fields[field_name], mongoengine.FloatField):
                return_data.append((field_name, float(data)))
            elif isinstance(obj._fields[field_name], mongoengine.IntField):
                return_data.append((field_name, int(data)))
            elif isinstance(obj._fields[field_name], mongoengine.ListField):
                return_data.append((field_name, data))
            elif isinstance(obj._fields[field_name], mongoengine.DateTimeField):
                date = getattr(obj, field_name)
                date = json_util.dumps(date)
                return_data.append((field_name, eval(date)['$date']))
            elif isinstance(obj._fields[field_name], mongoengine.BooleanField):
                data = getattr(obj, field_name)
                return_data.append((field_name, data))
            elif isinstance(obj._fields[field_name], mongoengine.DictField):
                return_data.append((field_name, data))
        return dict(return_data)
    for field_name in obj._fields:
        if field_name in ("id",):
            oid = getattr(obj, field_name)
            return_data.append(("pk", str(oid)))
            continue

        data = obj._data[field_name]

        if isinstance(obj._fields[field_name], mongoengine.StringField):
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.FloatField):
            return_data.append((field_name, float(data)))
        elif isinstance(obj._fields[field_name], mongoengine.IntField):
            return_data.append((field_name, int(data)))
        elif isinstance(obj._fields[field_name], mongoengine.ListField):
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.DateTimeField):
            date = getattr(obj, field_name)
            date = json_util.dumps(date)
            return_data.append((field_name, eval(date)['$date']))
        elif isinstance(obj._fields[field_name], mongoengine.BooleanField):
            data = getattr(obj, field_name)
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.DictField):
            return_data.append((field_name, data))

    return dict(return_data)


def mongo_to_dict_helper_without_pk(obj, fields=None):
    return_data = []

    for field_name in obj._fields:
        if field_name in ("id",):
            continue

        data = obj._data[field_name]

        if isinstance(obj._fields[field_name], mongoengine.StringField):
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.FloatField):
            return_data.append((field_name, float(data)))
        elif isinstance(obj._fields[field_name], mongoengine.IntField):
            return_data.append((field_name, int(data)))
        elif isinstance(obj._fields[field_name], mongoengine.ListField):
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.DateTimeField):
            date = getattr(obj, field_name)
            date = json_util.dumps(date)
            return_data.append((field_name, eval(date)))
        elif isinstance(obj._fields[field_name], mongoengine.BooleanField):
            data = getattr(obj, field_name)
            return_data.append((field_name, data))
        elif isinstance(obj._fields[field_name], mongoengine.DictField):
            return_data.append((field_name, data))

    return dict(return_data)


def timestamp():
    now = datetime.utcnow().replace(tzinfo=utc)
    return now


def timestamp_sec():
    now = timestamp()
    seconds = time.mktime(now.timetuple())
    return seconds * 1000


def http_put(url, dict_obj):
    URL = settings.PARENT_DOMAIN + url
    dict_obj['api_key'] = settings.HERMES_API_KEY
    print(dict_obj)
    r = requests.put(URL, data=dict_obj)
    f = open("/home/kirill/e", "w")
    f.write(r.text)
    f.close()
    print(r.text)
    return r


def http_get(url):
    URL = settings.PARENT_DOMAIN + url
    r = requests.get(URL)
    return r.json()
