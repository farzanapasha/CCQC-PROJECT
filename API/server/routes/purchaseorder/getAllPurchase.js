import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import PurchaseOrderService from './../../services/purchaseorder'

export default class PurchaseOrderController {
    
    static getAll(req, res) {
        PurchaseOrderService.getAllPurchase.getAll()
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