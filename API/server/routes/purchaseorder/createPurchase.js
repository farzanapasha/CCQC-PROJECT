import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import PurchaseOrderService from './../../services/purchaseorder'

export default class PurchaseOrderController {
    static create(req, res) {
        const purchase = Object.assign({
        }, _pick(req.body, [`item_id`,`client_id`,`workorder_id`,`quantity`,
        `description`,`cost`,`tax`,`datecreated`,"attachment"]), {
            'createdby': req.session.user.email,
        });
        const rules = {"item_id":"required",
        "client_id":"required",
        "workorder_id":"required"}
        Validator.run(purchase, rules).then(() => {
            return PurchaseOrderService.createPurchase.create(purchase)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}