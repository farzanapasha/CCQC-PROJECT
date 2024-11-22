import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import WorkOrderService from './../../services/workorder'

export default class WorkOrderController {
    
    static getAll(req, res) {
        WorkOrderService.getAllWorkOrder.getAll()
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