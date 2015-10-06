from mongoengine import fields
from basic_documents import model_types

"""
    from https://fhir-ru.github.io/datatypes.html#Period
"""


class Period(fields.EmbeddedDocument):
    start = fields.DateTimeField()
    end = fields.DateTimeField()


"""
    from https://fhir-ru.github.io/datatypes.html#ContactPoint
"""


class ContactPoint(fields.EmbeddedDocument):
    system = fields.StringField(
        choices=model_types.CONTACT_POINT_SYSTEM_TYPES.items()
    )
    value = fields.StringField(max_length=150)
    use = fields.StringField(
        choices=model_types.CONTACT_POINT_USE_TYPES.items()
    )
    period = fields.EmbeddedDocumentField(Period)

"""
    from https://fhir-ru.github.io/datatypes.html#Address
"""


class Address(fields.EmbeddedDocument):
    use = fields.StringField(
        choices=model_types.ADDRESS_USE_TYPES.items()
    )
    type_ = fields.StringField(
        choices=model_types.ADDRESS_TYPE_TYPES.items()
    )
    line = fields.ListField(
        fields.StringField()
    )
    city = fields.StringField()
    state = fields.StringField()
    country = fields.StringField()
    postalCode = fields.StringField()  # or 'zip'
    period = fields.EmbeddedDocumentField(
        Period
    )


"""
    from https://fhir-ru.github.io/datatypes.html#Attachment

    see:
        https://fhir-ru.github.io/patient-example-f201-roel.json.html (photo)
        https://fhir-ru.github.io/media-example.json.html (content)
"""


class Attachment(fields.Document):
    owner = fields.IntField()  # User.pk

    """
        gcloud_path={
            'bucket':'lllllll',
            'file': 'file.jpg'
            }
    """
    ext = fields.StringField()
    gcloud_path = fields.DictField()
    title = fields.StringField()
    creation = fields.DateTimeField()
    timestamp = fields.DateTimeField()


class FhirDoc(fields.Document):
    Condition = fields.DictField()
    Observations = fields.DictField()
    MedicationPrescription = fields.DictField(default={'entry': []})
    MedicationDispence = fields.DictField()
    Procedure = fields.DictField()
    Immunization = fields.DictField()
    FamilyHistory = fields.DictField()
    AllergyIntolerance = fields.DictField()
    ImagingStudy = fields.DictField()
    CarePlan = fields.DictField()
    Treatment = fields.DictField(default={'entry': []})
