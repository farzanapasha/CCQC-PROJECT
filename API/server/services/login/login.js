import _pick from 'lodash/pick';
import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import Token from './../../helpers/token';

export default class loginServices {
    static login(user) {
        return DB("user")
            .join('role', 'user.role_id', '=', 'role.id')
            .where('user.email', '=', user.email)
            .andWhere('user.deleted', '=', false)
            .select('user.email', 'role.name as role', 'user.password',
                    'user.name', 'user.gender', 'user.phone', 'user.id')
            .then(data => {
                if (data.length) {
                    if (data[0].password === user.password) {
                        return {
                            isAuth: true,
                            user: _pick(data[0], ['id', 'name', 'email', 'gender', 'role', 'phone']),
                            token: Token.renew(_pick(data[0], ['id', 'name', 'email', 'gender', 'role', 'phone']))
                        };
                    } else {
                        throw new Error(Exception.INVALID_PASSWORD_EXCEPTION); // Ensure this is "'invalidPasswordException';"
                    }
                } else {
                    throw new Error(Exception.INVALID_USER_EXCEPTION); // Ensure this is "'invalidUserException';"
                }
            })
            .catch(err => {
                console.log(err.message);
                throw new Error(err.message);
            });
    }
}

