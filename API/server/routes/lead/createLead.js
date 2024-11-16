import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import LeadService from './../../services/lead'

export default class LeadController {
    static create(req, res) {
        const lead = Object.assign({
        }, _pick(req.body, ['name', 'email', 'phone','phonecode', 'gender','status',
        'service','location','source']), {
            'createdby': req.session.user.email,
            'deleted': false,
        });
        const rules = {"name":"required",
        "gender":"required",
        "email":"required",
        "phone":"required",
        "phonecode":"required",
        "status":"required",
        "service":"required",
        "location":"required",
        "source":"required"}
        Validator.run(lead, rules).then(() => {
            return LeadService.createLead.create(lead)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}