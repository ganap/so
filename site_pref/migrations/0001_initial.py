# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import L18n.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SitePreferences',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('last_paypal_transaction_id', L18n.fields.ListField()),
                ('title', models.CharField(default=b'Second Opinion', max_length=100)),
                ('keywords', models.CharField(default=b'', max_length=400, blank=True)),
                ('description', models.CharField(default=b'', max_length=500, blank=True)),
                ('use_shutdown', models.BooleanField(default=False)),
                ('shutdown_text', models.CharField(default=b'', max_length=500, blank=True)),
                ('shutdown_date_start', models.DateTimeField(null=True, blank=True)),
                ('shutdown_date_end', models.DateTimeField(null=True, blank=True)),
                ('shutdown_send_mail_msg', models.BooleanField(default=True)),
                ('shutdown_wall_mail_text', models.CharField(default=b'', max_length=500, blank=True)),
            ],
        ),
    ]
