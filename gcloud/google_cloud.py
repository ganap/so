
import os
import boto
import gcs_oauth2_boto_plugin
import shutil

from django.conf import settings


import hlprs as helpers
import helpers as main_helpers
IMAGES_EXT = ['.jpg', '.png', '.tiff', '.gif']


# connecting to google cloud
gcs_oauth2_boto_plugin.SetFallbackClientIdAndSecret(settings.GS_CLIENT_ID,
                                                    settings.GS_CLIENT_SECRET)


def save_tmp_file(fileobj, filename, ext):
    if ext in IMAGES_EXT:
        f = open("/tmp/" + filename + ext, 'wb')
        shutil.copyfileobj(fileobj, f)
        f.close()
        helpers.resize_image(filename, ext)
        if ext != '.jpg':
            os.remove("/tmp/" + filename + ext)
        return '.jpg'
    if ext in ['.txt']:
        f = open("/tmp/" + filename + ext, 'w')
        shutil.copyfileobj(fileobj, f)
        f.close()
        return ext
    if ext in ['.dcm', '.dicom']:
        f = open("/tmp/" + filename + ext, 'w')
        shutil.copyfileobj(fileobj, f)
        f.close()
        o = dir(main_helpers.dicom)
        try:
            main_helpers.dicom.saveDicomAsImage("/tmp/" + filename + ext,
                                                "/tmp/" + filename + ext + ".thumbnail.jpg")
        except:
            shutil.copy(
                os.path.join(settings.BASE_DIR, 'static/img/files/dicom.png'),
                "/tmp/" + filename + ext + ".thumbnail.png"
            )
        return ext
    f = open("/tmp/" + filename + ext, 'wb')
    shutil.copyfileobj(fileobj, f)
    f.close()
    return ext


def upload_to_gc(fileobj):
    filename = helpers.generate_filename(fileobj.name)
    ext = os.path.splitext(fileobj.name)[-1].lower()

    #
    ext = save_tmp_file(fileobj, filename, ext)
    dst_uri = boto.storage_uri(settings.GS_STORAGE_BUCKET + '/' +
                               filename + ext, settings.GS_URI_SCHEME)

    dst_uri.new_key().set_contents_from_filename("/tmp/" + filename + ext)
    gcloud_path = dst_uri.object_name
    os.remove("/tmp/" + filename + ext)
    if ext in ['.jpg']:
        # upload thumbnail
        dst_uri = boto.storage_uri(settings.GS_STORAGE_BUCKET + '/' +
                                   filename + ext + ".thumbnail.jpg",
                                   settings.GS_URI_SCHEME)
        dst_uri.new_key().set_contents_from_filename("/tmp/" + filename + ext +
                                                     '.thumbnail.jpg')

        os.remove("/tmp/" + filename + ext + ".thumbnail.jpg")
    elif ext in ['.dcm', '.dicom']:
        # upload thumbnail
        dst_uri = boto.storage_uri(settings.GS_STORAGE_BUCKET + '/' +
                                   filename + ext + ".thumbnail.jpg",
                                   settings.GS_URI_SCHEME)
        dst_uri.new_key().set_contents_from_filename("/tmp/" + filename + ext +
                                                     '.thumbnail.png')

        os.remove("/tmp/" + filename + ext + ".thumbnail.png")

    return (gcloud_path, ext)


def delete_from_gc(filepath):
    uri = boto.storage_uri(settings.GS_STORAGE_BUCKET, settings.GS_URI_SCHEME)
    bucket = uri.get_bucket()
    bucket.delete_key(filepath)
    uri.delete()
