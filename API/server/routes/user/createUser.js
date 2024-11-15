import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import UserService from './../../services/user'

export default class UserController {
    static create(req, res) {
        const user = Object.assign({
            password: "eletech"
        }, _pick(req.body, ['name', 'email', 'phone', 'gender', 'role_id']), {
            'createdby': req.session.user.email,
            'deleted': false,
            'createdon': Time.now(Time.DEFAULT_FORMAT)
        });
        const rules = {
            name: 'required',
            email: 'required',
            phone: 'required',
            gender: 'required',
            role_id:'required'
        };
        Validator.run(user, rules).then(() => {
            return UserService.createUser.create(user)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}