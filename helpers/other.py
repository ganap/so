import string
import random


def id_generator(size=6, use_digits=True):
    if use_digits:
        chars = string.ascii_uppercase + string.digits
    else:
        chars = string.ascii_uppercase
    return ''.join(random.choice(chars) for _ in range(size))
