import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import LoginServices from './../../services/login';


export default class UserController {
static changePassword(req, res) {
    const user = Object.assign({}, _pick(req.body, [ 'oldPassword', 'newPassword']));
    const rules = {
        oldPassword: 'required',
        newPassword:'required'
    };
    Validator.run(user, rules).then(() => {
        return LoginServices.changePassword.changePassword(req.session.user.email,user)
    }).then((result) => {
        res.status(200).json({
            data: result
        });
    }).catch((err) => {
        Exception.failWith(req, res, err);
    });
}
}
