import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import PaymentService from './../../services/payment'

export default class PaymentController {
    
    static getAll(req, res) {
        PaymentService.getAllPayment.getAll()
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