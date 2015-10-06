# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from site_pref import models
import helpers

helpers.MongoDbConnect()


class Command(BaseCommand):
    args = ''
    help = 'Creates initial objects for SiteEmails and SitePref'

    def handle(self, *args, **options):
        self.stdout.write("::::Create Site Emails & Site Preferences...")

        refer_friend = "User {{from_user}} invites you to register at {{site_pref.title}}. Please follow this <a href='{{SITE_URL}}/#/{{refer_pk}}'>link</a> to create your User Profile. After getting registered and profile filled for at least 60%, you get a 1 month Premium account absolutely free!"
        models.SiteEmails.objects().delete()
        e = models.SiteEmails(
            name='refer_friend',
            subject='Refer friend',
            html=refer_friend,
            var_list=['from_user', 'SITE_URL', 'refer_pk', 'site_pref.title']
        )
        e.save()

        create_account = """<h2>Hello from {{site_pref.title}}!</h2>
            <p>You'r username is <strong>{{ username }}</strong> and password is <strong>{{ raw_password }}</strong>. Use this <a href="{{ SITE_URL }}" >link</a> to log in to site!</p>"""
        e = models.SiteEmails(
            name='create_account',
            subject="Hello from {{site_pref.title}}",
            html=create_account,
            var_list=[
                    'SITE_URL', 'username', 'raw_password', 'site_pref.title']
        )
        e.save()

        reset_password = """
<h2>Hello from {{site_pref.title}}!</h2>

<p> To reset your password please follow this <a href="{{SITE_URL}}/reset-password/{{reset_url}}"> link </a>. </p>
<p>Your username is <b>{{user.username}}</b>. If you have not requested the password reset, please ignore this email. </p>
        """
        e = models.SiteEmails(
            name='reset_password',
            subject="Reset password on {{site_pref.title}}",
            html=reset_password,
            var_list=[
                    'SITE_URL', 'user.username', 'reset_url', 'site_pref.title']
        )
        e.save()

        self.stdout.write(repr(models.SiteEmails.objects()))

        models.SitePreferences.objects.all().delete()
        sf = models.SitePreferences.objects.create()

        self.stdout.write("::::END")
