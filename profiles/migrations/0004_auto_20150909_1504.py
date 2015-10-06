# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_auto_20150907_1524'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mainuser',
            old_name='profile',
            new_name='patient',
        ),
    ]
