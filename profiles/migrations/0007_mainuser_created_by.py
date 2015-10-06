# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0006_mainuser_socket_user_oid'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainuser',
            name='created_by',
            field=models.IntegerField(default=0),
        ),
    ]
