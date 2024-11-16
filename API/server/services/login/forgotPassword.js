import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import DB from './../../helpers/db';


export default class UserController {
static forgotPassword(req, res) {
    const {
        email
    } = req.params;
    const rules = {
        email: 'required'
    };
    Validator.run({
        email
    }, rules).then(() => {
        return UserService.getUser(id);
    }).then((result) => {
        res.status(200).json({
            data: result
        });
    }).catch((err) => {
        Exception.failWith(req, res, err);
    });
}
}
