import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import WorkOrderService from './../../services/workorder'

export default class WorkOrderController {
    static create(req, res) {
        const work = Object.assign({"type":"",
        "location":"",
        }, _pick(req.body, ['type', 'location', 'description',"client_id","status_id"]), {
            'createdby': req.session.user.email,
            deleted:false
        });
        const rules = {
        "client_id":"required",
        "status_id":"required"
    }
        Validator.run(work, rules).then(() => {
            return WorkOrderService.createWorkOrder.create(work)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}