import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import ClientService from './../../services/client'

export default class ClientController {
static convert(req, res) {
    const {
        id
    } = req.body;
    const rules = {
        id: 'required'
    };
    Validator.run({
        id
    }, rules).then(() => {
        return ClientService.convertLeadToClient.convert(id,req.session.user.email);
    }).then((result) => {
        res.status(200).json({
            data: result
        });
    }).catch((err) => {
        Exception.failWith(req, res, err);
    });
}
}
