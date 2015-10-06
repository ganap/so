# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import L18n.fields


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0007_mainuser_created_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='pk_can_edit',
            field=L18n.fields.ListField(default=[]),
        ),
    ]
