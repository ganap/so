import os
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import datetime
from PIL import Image, ImageEnhance


def save_file_at_spesial_path(filename, obj):
    fss = FileSystemStorage()
    year = datetime.datetime.now().year
    month = datetime.datetime.now().month

    path = os.path.join("spesial", str(year), str(month), filename)
    path = fss.get_available_name(path)
    filepath = os.path.join(settings.MEDIA_ROOT, path)

    dirpath = os.path.dirname(filepath)
    if not os.path.exists(dirpath):
        try:
            os.makedirs(dirpath)
        except:
            pass
    f = open(filepath, 'wb')
    f.write(obj.read())
    f.close()
    return path


def get_picture_path(filename, album_pk):

    fss = FileSystemStorage()
    year = datetime.datetime.now().year
    month = datetime.datetime.now().month

    path = os.path.join("gallery", str(year), str(month),
                        str(album_pk), filename)
    return fss.get_available_name(path)


def get_video_path(filename, album_pk):

    fss = FileSystemStorage()
    year = datetime.datetime.now().year
    month = datetime.datetime.now().month

    path = os.path.join("video", str(year), str(month),
                        str(album_pk), filename)
    return fss.get_available_name(path)


def save_file(filename, obj):
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    dirpath = os.path.dirname(filepath)
    try:
        os.makedirs(dirpath)
    except:
        pass
    f = open(filepath, 'wb')
    f.write(obj.read())
    f.close()
    im = Image.open(filepath)
    WIDTH_MAX = 600
    HEIGHT_MAX = 600
    if im.size[0] > WIDTH_MAX or im.size[0] > HEIGHT_MAX:
        im.thumbnail([WIDTH_MAX, HEIGHT_MAX], Image.ANTIALIAS)
        im.save(filepath, "JPEG")


def save_video_file(filename, obj):
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    dirpath = os.path.dirname(filepath)
    try:
        os.makedirs(dirpath)
    except:
        pass
    f = open(filepath, 'wb')
    f.write(obj.read())
    f.close()


"""

from ffvideo import VideoStream
def generate_video_thumbnail(filename):
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    outfile = filepath + ".thumbnail.jpg"

    vs = VideoStream(filepath,
                     frame_size=(320, 170),  # scale to width 128px
                     # frame_mode='L')  # convert to grayscale
                     )

    frame = vs.get_frame_at_sec(3)

    # PIL image, required installed PIL
    frame.image().save(outfile)
"""


def generate_thumbnail(filename):
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    outfile = filepath + ".thumbnail.jpg"
    resize_and_crop(filepath, outfile, (320, 170), crop_type='middle')
    return outfile


def generate_avatar(filename, user_pk):
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    outfile = os.path.join(
        settings.MEDIA_ROOT, "avatars", str(user_pk))
    resize_and_crop(filepath, outfile + "-sidebar.jpg",
                   (154, 137), crop_type='middle', quality=90)
    resize_and_crop(filepath, outfile + "-search.jpg",
                   (275, 188), crop_type='middle', quality=80)
    resize_and_crop(filepath, outfile + "-tiny.jpg",
                   (50, 50), crop_type='middle', quality=50)


def generate_single_avatar(filename, user_pk):
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    outfile = os.path.join(
        settings.MEDIA_ROOT, "avatars", str(user_pk))
    resize_and_crop(filepath, outfile + "-tiny.jpg",
                   (50, 50), crop_type='middle', quality=100)
    resize_and_crop(filepath, outfile + "-search.jpg",
                   (200, 200), crop_type='middle', quality=80)


def resize_and_crop(img_path, modified_path, size, crop_type='top', quality=90):
    """
    Resize and crop an image to fit the specified size.

    args:
        img_path: path for the image to resize.
        modified_path: path to store the modified image.
        size: `(width, height)` tuple.
        crop_type: can be 'top', 'middle' or 'bottom', depending on this
            value, the image will cropped getting the 'top/left', 'midle' or
            'bottom/rigth' of the image to fit the size.
    raises:
        Exception: if can not open the file in img_path of there is problems
            to save the image.
        ValueError: if an invalid `crop_type` is provided.
    """
    # If height is higher we resize vertically, if not we resize horizontally
    img = Image.open(img_path)
    # Get current and desired ratio for the images
    img_ratio = img.size[0] / float(img.size[1])
    ratio = size[0] / float(size[1])
    # The image is scaled/cropped vertically or horizontally depending on the
    # ratio
    if ratio > img_ratio:
        img = img.resize((size[0], size[0] * img.size[1] / img.size[0]),
                         Image.ANTIALIAS)
        # Crop in the top, middle or bottom
        if crop_type == 'top':
            box = (0, 0, img.size[0], size[1])
        elif crop_type == 'middle':
            box = (0, (img.size[1] - size[1]) / 2, img.size[
                   0], (img.size[1] + size[1]) / 2)
        elif crop_type == 'bottom':
            box = (0, img.size[1] - size[1], img.size[0], img.size[1])
        else:
            raise ValueError('ERROR: invalid value for crop_type')
        img = img.crop(box)
    elif ratio < img_ratio:
        img = img.resize((size[1] * img.size[0] / img.size[1], size[1]),
                         Image.ANTIALIAS)
        # Crop in the top, middle or bottom
        if crop_type == 'top':
            box = (0, 0, size[0], img.size[1])
        elif crop_type == 'middle':
            box = ((img.size[0] - size[0]) / 2, 0, (
                img.size[0] + size[0]) / 2, img.size[1])
        elif crop_type == 'bottom':
            box = (img.size[0] - size[0], 0, img.size[0], img.size[1])
        else:
            raise ValueError('ERROR: invalid value for crop_type')
        img = img.crop(box)
    else:
        img = img.resize((size[0], size[1]),
                         Image.ANTIALIAS)
        # If the scale is the same, we do not need to crop
    img.save(modified_path, quality=quality)


"""
    Watermark
"""


def reduce_opacity(im, opacity):
    """Returns an image with reduced opacity."""
    assert opacity >= 0 and opacity <= 1
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    else:
        im = im.copy()
    alpha = im.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    im.putalpha(alpha)
    return im


def watermark(im, mark, position, opacity=1):
    """Adds a watermark to an image."""
    if opacity < 1:
        mark = reduce_opacity(mark, opacity)
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    # create a transparent layer the size of the image and draw the
    # watermark in that layer.
    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
    if position == 'tile':
        for y in range(0, im.size[1], mark.size[1]):
            for x in range(0, im.size[0], mark.size[0]):
                layer.paste(mark, (x, y))
    elif position == 'scale':
        # scale, but preserve the aspect ratio
        ratio = min(
            float(im.size[0]) / mark.size[0], float(im.size[1]) / mark.size[1])
        w = int(mark.size[0] * ratio)
        h = int(mark.size[1] * ratio)
        mark = mark.resize((w, h))
        layer.paste(mark, ((im.size[0] - w) / 2, (im.size[1] - h) / 2))
    else:
        layer.paste(mark, position)
    # composite the watermark with the layer
    return Image.composite(layer, im, layer)


def generate_watermark(filename):
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    watermarkpath = os.path.join(settings.MEDIA_ROOT, "watermark.png")
    im = Image.open(filepath)
    mark = Image.open(watermarkpath)

    new_file = watermark(im, mark, (0, 0), 0.5)
    new_file.save(filepath)
    return filepath
