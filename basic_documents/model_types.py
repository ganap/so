import mimetypes
"""
    from https://fhir-ru.github.io/name-use.html
"""
NAME_USE_TYPES = {'usual': 'Usual',
                  'official': 'Official',
                  'temp': 'Temp',
                  'nickname': 'Nickname',
                  'anonymous': 'Anonymous',
                  'old': 'Old',
                  'maiden': 'Maiden',
                  }
"""
    from https://fhir-ru.github.io/contact-point-system.html
"""
CONTACT_POINT_SYSTEM_TYPES = {'phone': 'Phone',
                              'fax': 'Fax',
                              'email': 'Email',
                              'url': 'Url',
                              }

"""
    from https://fhir-ru.github.io/contact-point-use.html
"""
CONTACT_POINT_USE_TYPES = {'home': 'Home',
                           'work': 'Work',
                           'temp': 'Temp',
                           'old': 'Old',
                           'mobile': 'Mobile',
                           }

"""
    from https://fhir-ru.github.io/address-use.html
"""

ADDRESS_USE_TYPES = {'home': 'Home',
                     'work': 'Work',
                     'temp': 'Temporary',
                     'old': 'Old/Incorrect',
                     }
"""
    from https://fhir-ru.github.io/address-type.html
"""
ADDRESS_TYPE_TYPES = {'postal': 'Postal',
                      'physical': 'Physical',
                      'both': 'Postal & Physical',
                      }

"""
    from https://fhir-ru.github.io/datatypes.html#Attachment
    see:
        MimeType
"""

ATTACHMENT_MIME_TYPE = mimetypes.types_map


"""
    from https://fhir-ru.github.io/condition-status.html
"""
CONDITION_CLINICAL_STATUS_TYPES = {
    'provisional': 'Provisional',
    'working': 'Working',
    'confirmed': 'Confirmed',
    'refuted': 'Refuted',
    'entered-in-error': 'Entered In Error',
    'unknown': 'Unknown'
}

"""
	from https://fhir-ru.github.io/quantity-comparator.html
"""
QUALITY_COMPARATOR_TYPES = {
    '<': 'Less than',
    '<=': 'Less or Equal to',
    '>=': 'Greater or Equal to',
    '>': 'Greater than'

}

OBSERVATION_RELIABILITY_TYPES = {
    'ok': 'Ok',
    'ongoing': 'Ongoing',
    'early': 'Early',
    'questionable': 'Questionable',
    'calibrating': 'Calibrating',
    'error': 'Error',
    'unknown': 'Unknown',
}
OBSERVATION_STATUS_TYPES = {
    'registered': 'Registered',
    'preliminary': 'Preliminary',
    'final': 'Final',
    'amended': 'Amended',
    'cancelled': 'Cancelled',
    'entered-in-error': 'Entered In Error',
    'unknown': 'Unknown',

}

TIMING_UNITS_TYPES = {
    's': 'second',
    'min': 'minute',
    'h': 'hour',
    'd': 'day',
    'wk': 'week',
    'mo': 'month',
    'a': 'annual'

}
TREATMENT_TYPES_CUSTOM_TYPES = {
    'c': 'Chemotherapy',
    'r': 'Radiation',
    's': 'Surgery',
    'a': 'Alternative Treatment',
}
