import _ from 'lodash';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import WorkOrderService from './../../services/workorder'

export default class WorkOrderController {

    static update(req, res) {
        const input = _.omit(Object.assign(req.body, {
            'modifiedby': req.session.user.email,
        }),['id']);
        const {
            id
        } = req.body;
        const rules = {
            id: 'required'
        };
        Validator.run({
                id
            }, rules).then(() => {
                return WorkOrderService.updateWorkOrder.update(id, input)
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