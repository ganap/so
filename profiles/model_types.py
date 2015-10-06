from django.conf import settings

"""
    from https://fhir-ru.github.io/administrative-gender.html
"""
GENDER_TYPES = {'male': 'Male',
                'female': 'Female',
                'other': 'Other',
                'unknown': 'Unknown',
                }

"""
    from https://fhir-ru.github.io/valueset-marital-status.html
"""

MARITAL_STATUS_TYPES = {'U': 'Unmarried',
                        'A': 'Annulled',
                        'D': 'Divorced',
                        'I': 'Interlocutory',
                        'L': 'Legally Separated',
                        'M': 'Married',
                        'P': 'Polygamous',
                        'S': 'Never Married',
                        'T': 'Domestic partner',
                        'W': 'Widowed',
                        }
"""
    from http://tools.ietf.org/html/bcp47
"""

LANGUAGES_TYPES = dict(settings.LANGUAGES)

"""
    from https://fhir-ru.github.io/valueset-patient-contact-relationship.html
"""

PATIENT_CONTACT_RELATIONSHIP_TYPES = {'emergency': 'Emergency',
                                      'family': 'Family',
                                      'guardian': 'Guardian',
                                      'friend': 'Friend',
                                      'partner': 'Partner',
                                      'work': 'Work',
                                      'agent': 'Agent',
                                      'guarantor': 'Guarantor',
                                      'parent': 'Parent',
                                      'health preffesional': 'Health Professional',  # !!!!not fhir
                                      '<CUSTOM>': 'Caregiver',  # !!!!not fhir
                                      }
