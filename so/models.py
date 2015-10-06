from mongoengine import fields


class SODiagnosis(fields.Document):
    owner = fields.IntField()
    from_expert = fields.IntField()
    summary = fields.StringField()
    second_opinion = fields.StringField()
    diagnosis = fields.StringField()
    so_obj = fields.DictField()
    request_info = fields.DictField()
    is_closed = fields.BooleanField(default=False)
    is_closed_by_user = fields.BooleanField(default=False)
