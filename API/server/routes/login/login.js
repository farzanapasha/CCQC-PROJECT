import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import LoginServices from './../../services/login';


export default class LoginController {
static login(req, res) {
    const user = Object.assign({    
    }, _pick(req.body, [ 'email', 'password']));
    const rules = {
        email: 'required',
        password:'required'
    };
    console.log(user)
    Validator.run(
        user
    , rules).then(() => {
        return LoginServices.login.login(user);
    }).then((result) => {
        res.status(200).json({
            data: result
        });
    }).catch((err) => {
        Exception.failWith(req, res, err);
    });
}
}
