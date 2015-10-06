# -*- coding: utf-8 -*-
from mongoengine import fields


class EveryDayMeasurements(fields.EmbeddedDocument):
    # count/minute
    heart_rate = fields.FloatField()
    # C
    body_temperature = fields.FloatField()
    # https://ru.wikipedia.org/wiki/%D0%91%D0%B0%D0%B7%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F_%D1%82%D0%B5%D0%BC%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D1%83%D1%80%D0%B0
    basal_body_temperature = fields.FloatField()
    # мм. ртутного столба | mm Hg
    blood_pressure_systolic = fields.FloatField()
    blood_pressure_diastolic = fields.FloatField()
    # https://en.wikipedia.org/wiki/Respiratory_rate
    # число дыхательных движений за одну минуту
    # number of breaths/minute
    respiratory_rate = fields.FloatField()
    body_mass = fields.FloatField()
    #
    gwb_anxiety = fields.IntField()
    gwb_concentration = fields.IntField()
    gwb_energy = fields.IntField()
    gwb_stress = fields.IntField()
    ss_fever = fields.IntField()
    ss_general_pain = fields.IntField()
    ss_sensory_problems = fields.IntField()
    ss_diarrhea = fields.IntField()
    ss_nausea = fields.IntField()
    ss_hair_loss = fields.IntField()
    ss_mouth_sores = fields.IntField()
    ss_fatigue = fields.IntField()
    timestamp = fields.DateTimeField()
    #
    i_took_today = fields.DictField()
    journal_entry = fields.StringField()


class Measurements(fields.Document):
    owner = fields.IntField()  # User.pk
    units = fields.StringField()
    height = fields.FloatField()
    body_mass = fields.FloatField()
    last_date = fields.DateTimeField()
    everyday_list = fields.EmbeddedDocumentListField(
        EveryDayMeasurements
    )
