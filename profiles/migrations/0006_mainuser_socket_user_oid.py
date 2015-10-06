# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_auto_20150923_1141'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='socket_user_oid',
            field=models.CharField(default=b'', max_length=30),
        ),
    ]
