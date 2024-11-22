import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import WorkorderStatusService from './../../services/workorderstatus'

export default class WorkorderStatusController {
    static create(req, res) {
        const status = Object.assign({
        }, _pick(req.body, ['name']), {
            'createdby': req.session.user.email
        });
        const rules = {"name":"required"}
        Validator.run(status, rules).then(() => {
            return WorkorderStatusService.createStatus.create(status)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}