import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import InvoiceService from './../../services/invoice'

export default class InvoiceController {
    static create(req, res) {
        const invoice = Object.assign({
        }, _pick(req.body, ['status', 'workorder_id', 'client_id','discount', 
        'rate','tax','item']), {
            'createdby': req.session.user.email,
            'deleted': false,
        });
        const rules = {
        "status":"required",
        "rate":"required",
        "tax":"required",
        "workorder_id":"required",
        "client_id":"required",
        "discount":"required",
    }
        Validator.run(invoice, rules).then(() => {
            return InvoiceService.createInvoice.create(invoice)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}