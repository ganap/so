# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import L18n.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DjCity',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('name_locale', L18n.fields.DictionaryField()),
                ('location', L18n.fields.ListField()),
            ],
        ),
        migrations.CreateModel(
            name='DjCountry',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=150)),
                ('name_locale', L18n.fields.DictionaryField()),
                ('code', models.CharField(max_length=2)),
            ],
        ),
        migrations.AddField(
            model_name='djcity',
            name='country',
            field=models.ForeignKey(to='L18n.DjCountry'),
        ),
    ]
