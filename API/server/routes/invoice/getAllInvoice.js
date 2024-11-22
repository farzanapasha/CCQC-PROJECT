import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import InvoiceService from './../../services/invoice'

export default class InvoiceController {
    
    static getAll(req, res) {
        InvoiceService.getAllInvoice.getAll()
            .then((result) => {
                res.status(200).json({
                    data: result
                });
            })
            .catch((err) => {
                Exception.failWith(req, res, err);
            });
    }
}