import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import ClientService from './../../services/client'

export default class ClientController {
    static create(req, res) {
        const client = Object.assign({
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
        Validator.run(client, rules).then(() => {
            return ClientService.createClient.create(client)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}