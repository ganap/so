import datetime
from django import template
from django.conf import settings
import os

register = template.Library()


def get_filelist(d, ext):
    listdir = os.listdir(d)
    filelist = []
    filelist_ = []
    for name in listdir:
        path = os.path.join(d, name)
        e = os.path.splitext(path)[-1].lower()
        if e == ext and os.path.isfile(path):
            filelist.append(path)
        elif os.path.isdir(path):
            filelist_ += get_filelist(path, ext)
    return filelist + filelist_


@register.simple_tag
def load_ng_app(app_name):
    static_dir = settings.STATICFILES_DIRS[0]
    file_list = get_filelist(static_dir + app_name + "/", '.js')
    html = ''
    for f in file_list:
        f = f.replace(settings.BASE_DIR, '')
        html += '<script src="%s"></script>\n' % f
    return '<!-- LOAD NG APP = ' + app_name + ' = -->\n' +\
        html +\
        '<!-- END = ' + app_name + ' = -->\n\n\n'
