import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import UserService from './../../services/user'

export default class UserController {
    static getAll(req, res) {
        UserService.getAllUser.getAll()
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