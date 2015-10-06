# -*- coding: utf-8 -*-
from site_pref import models


def get_real_amount(offer_type, period, site_pref):
    if offer_type == 'pr':  # premium
        return getattr(site_pref, 'premium_price_' + period)


def verify_ipn(ipn_obj):

    # цена за услугу(без налогов и коммисии)
    amount = float(ipn_obj.mc_gross)

    # номер транзакции в paypal
    transaction_id = ipn_obj.txn_id
    #
    invoice = ipn_obj.invoice.split("=")
    #
    user_pk = int(invoice[0])
    date = invoice[1]
    # period = invoice[2]
    """
        в первую очередь проверяем что json пришел именно от paypal.
        заново отправляем весь словарь на их сервер и ожидаем увидеть
        VERIFIED в ответе.
    """
    response = ipn_obj._postback()
    if 'VERIFIED' not in response:
        return (False, 'Paypal failed to verify this transaction.',
                {
                'transaction_id': transaction_id,
                'user_pk': user_pk,
                'date': date,
                'amount': amount,
                }
                )

    """
        теперь проверяем все остальное
    """

    # site_pref = models.SitePreferences.objects.all()[0]

    """
        проверяем есть ли запись этой transaction_id в списке недавно обработанных
    """
    # if transaction_id in site_pref.last_paypal_transaction_id:
    #    return (False, None)
    """
        проверяем правильность цены в ответе от сервера paypal:
    """
    # настоящая цена за услугу:
    # real_amount = get_real_amount(offer_type, period, site_pref)
    real_amount = 50
    # отмена предварительно оплаченного платежа:
    if amount < 0:
        return (False, None)
    # во избежание того что paypal в один прекрасный момент может
    # отнимать от суммы по платежу свои комиссионные и отдавать
    # неправильную цену:

    if amount < real_amount * 0.94:
        return (False, 'Wrong amount for this offer. ', {
            'transaction_id': transaction_id,
            'user_pk': user_pk,
            'date': date,
            'amount': amount,
            'real_amount': real_amount
        })

    return (True, {
            'transaction_id': transaction_id,
            'user_pk': user_pk,
            'date': date,
            'amount': amount,
            'real_amount': real_amount
            })
