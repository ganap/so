

import info
import users
import helpers


def dictToList(obj, field):
    obj = obj.get(field, None)
    if not obj:
        return []
    if type(obj) == type([]):
        return obj
    l = []
    for key in obj.keys():
        l.append(obj[key])
    return l


def getDateTimeOrNone(date):
    if not date:
        return None
    return helpers.date.timestamp_to_datetime(date)
    try:
        pass
    except:
        return None


def Period(period):
    if not period:
        obj = info.Period(
            start=None,
            end=None,
        )
        return obj
    try:
        obj = info.Period(
            start=getDateTimeOrNone(period.get('start', None)),
            end=getDateTimeOrNone(period.get('end', None)),
        )
        return obj
    except:
        obj = info.Period(
            start=None,
            end=None,
        )
        return obj


def HumanName(humanName):
    try:
        obj = users.HumanName(
            use=humanName.get('use', 'usual'),
            family=dictToList(humanName, 'family'),
            given=dictToList(humanName, 'given'),
            prefix=dictToList(humanName, 'prefix'),
            suffix=dictToList(humanName, 'suffix'),
            period=Period(humanName['period']),
        )
        return obj
    except:
        return None


def ContactPoint(contactPoint):
    try:
        obj = info.ContactPoint(
            system=contactPoint.get('system', ''),
            value=contactPoint.get('value'),
            use=contactPoint.get('use', 'home'),
            period=Period(contactPoint.get('period', None))
        )
        return obj
    except:
        return None


def Address(address):
    try:
        addr_type = address.get('type_', None)
        if addr_type == None:
            addr_type = address.get('type', 'both')
        postalCode = address.get('postalCode', None)
        if postalCode == None:
            postalCode = address.get('zip', '')
        obj = info.Address(
            use=address.get('use', ''),
            type_=addr_type,
            line=address.get('line', []),
            state=address.get('state', ''),
            country=address.get('country', ''),
            city=address.get('city', ''),
            postalCode=postalCode,
            period=Period(address.get('period', None))
        )
        return obj
    except:
        return None


def ListObj(data, class_):
    list_obj = []
    for d in data:
        obj = class_(d)
        if obj:
            list_obj.append(obj)
    return list_obj
