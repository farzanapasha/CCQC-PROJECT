import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import DB from './../../helpers/db';


export default class UserController {
    static changePassword(email, user) {
        return DB("user").where('user.email', '=', email).then(data => {
            if (data.length) {
                if (data[0].password === user.oldPassword) {
                    return DB('user').where({
                        email: email
                    }).update({
                        password: user.newPassword
                    }).then(updated => {
                        return {
                            message: "updated successfully"
                        }
                    })
                } else {
                    throw new Error(Exception.INVALID_PASSWORD_EXCEPTION);
                }
            } else {
                throw new Error(Exception.INVALID_USER_EXCEPTION);
            }
        }).catch((err) => {
            console.log(err)
            throw new Error(err.message);
        });
    }
}