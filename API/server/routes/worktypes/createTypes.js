import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import WorkTypeService from './../../services/worktypes'

export default class LeadController {
    static create(req, res) {
        const types = Object.assign({
        }, _pick(req.body, ['name']), {
            'createdby': req.session.user.email
        });
        const rules = {"name":"required"}
        Validator.run(types, rules).then(() => {
            return WorkTypeService.createTypes.create(types)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}