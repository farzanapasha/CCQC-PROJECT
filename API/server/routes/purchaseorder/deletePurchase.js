import _ from 'lodash';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import PurchaseOrderService from './../../services/purchaseorder'

export default class PurchaseOrderController {

    static delete(req, res) {
        const {
            id
        } = req.query;
        const rules = {
            id: 'required'
        };
        Validator.run({
                id
            }, rules).then(() => {
                return PurchaseOrderService.deletePurchase.delete(id)
            }).then((result) => {
                res.status(200).json({
                    data: result
                });
            })
            .catch((err) => {
                Exception.failWith(req, res, err);
            });
    }

}