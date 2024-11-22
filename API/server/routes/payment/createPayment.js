import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import PaymentService from './../../services/payment'

export default class PaymentController {
    static create(req, res) {
        const payment = Object.assign({
        }, _pick(req.body, ['invoice_id', 'client_id','memo', 'amount','paymode',
        'recive_date']), {
            'createdby': req.session.user.email,
            deleted:false       });
        const rules = {"invoice_id":"required",
        "client_id":"required",
        "amount":"required",
        "paymode":"required",
        "recive_date":"required"
    }
        Validator.run(payment, rules).then(() => {
            return PaymentService.createPayment.create(payment)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}