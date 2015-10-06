from basic_documents import model_types
from basic_documents import info
from mongoengine import fields


"""
    from https://fhir-ru.github.io/datatypes.html#HumanName
"""


class HumanName(fields.EmbeddedDocument):
    use = fields.StringField(
        choices=model_types.NAME_USE_TYPES.items(), required=False)
    family = fields.ListField(
        fields.StringField(max_length=100),
        default=[]
    )
    given = fields.ListField(
        fields.StringField(max_length=100),
        default=[]
    )
    prefix = fields.ListField(
        fields.StringField(max_length=100),
        default=[]
    )
    suffix = fields.ListField(
        fields.StringField(max_length=100),
        default=[]
    )
    period = fields.EmbeddedDocumentField(
        info.Period
    )
