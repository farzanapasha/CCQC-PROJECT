import jwt from 'jwt-simple';

import Time from './../time';
import Defines from './../../config';
import Exception from './../../helpers/exception';

export default class JWT {
    /**
     * @param {String} email
     * @param {Object} [userInfo]
     * @return {String}
     */
    static renew(user) {
        const exp = Time.addTimeFromNow(Defines.TOKEN_EXPIRATION, Defines.TOKEN_EXPIRATION_TYPE);
        const token = jwt.encode({
            exp: exp,
            user: user
        }, Defines.TOKEN_SECRET);
            return {
                token: token
            };
    }

    static decode(token) {
        try {
            return jwt.decode(token, Defines.TOKEN_SECRET);
        } catch (err) {
            throw new Error(Exception.INVALID_TOKEN_EXCEPTION);
        }
    }
}