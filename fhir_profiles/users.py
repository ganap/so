import helpers

from mongoengine import fields
from profiles import model_types
from basic_documents import users, info

# class PatientContact(fields.EmbeddedDocument):
#    relationship = fields.


class Patient(fields.Document):
    owner = fields.IntField(default=0)
    name = fields.ListField(
        fields.EmbeddedDocumentField(users.HumanName)
    )
    telecom = fields.ListField(
        fields.EmbeddedDocumentField(info.ContactPoint)
    )
    gender = fields.StringField()
    birthDate = fields.DateTimeField()
    maritalStatus = fields.StringField()
    address = fields.ListField(
        fields.EmbeddedDocumentField(info.Address)
    )
    photo = fields.ListField(
        fields.StringField()
    )  # path to image


class Expert(fields.Document):
    owner = fields.IntField(default=0)
    name = fields.EmbeddedDocumentField(users.HumanName)
    gender = fields.StringField()
    photo = fields.ListField(
        fields.StringField()
    )  # path to image
    degree = fields.StringField()
    speciality = fields.StringField()
    clinical_expertise = fields.StringField()
    link_to_drupal = fields.StringField()


class RelatedPerson(fields.Document):
    owner = fields.IntField(default=0)
    relationship = fields.ListField(
        fields.StringField()
    )
    name = fields.EmbeddedDocumentField(
        users.HumanName
    )
    telecom = fields.ListField(
        fields.EmbeddedDocumentField(info.ContactPoint)
    )
    address = fields.EmbeddedDocumentField(
        info.Address
    )
    gender = fields.StringField()
    period = fields.EmbeddedDocumentField(
        info.Period
    )
