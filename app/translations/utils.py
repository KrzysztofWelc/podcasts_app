from flask import request
from app.translations.pl import translations as pl
from app.translations.en import translations as en


def t(unit):
    if request.headers.get('Browserlang') == 'pl' or not request.headers.get('Browserlang'):
        try:
            return pl[unit]
        except KeyError:
            return unit
    else:
        try:
            return en[unit]
        except KeyError:
            return unit
