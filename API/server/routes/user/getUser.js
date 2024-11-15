import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import UserService from './../../services/user'


export default class UserController {
static getUser(req, res) {
    const {
        id
    } = req.query;
    const rules = {
        id: 'required'
    };
    Validator.run({
        id
    }, rules).then(() => {
        return UserService.getUser.getUser(id);
    }).then((result) => {
        res.status(200).json({
            data: result
        });
    }).catch((err) => {
        Exception.failWith(req, res, err);
    });
}
}
