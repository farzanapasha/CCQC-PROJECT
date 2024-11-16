import _get from 'lodash/get';
import _find from 'lodash/find';

import Token from './../../token';
import Time from './../../time';
import Exception from './../../exception';
import Util from './../../../helpers/util';

// acl.config(RoleURLAccessService.getAll());

export default class JWT {

    static createApiMiddleware(options) {
        const whiteList = options.whiteList;
        const pathRegexp = options.pathRegexp;

        const pathMatcher = (p) => {
            return pathRegexp.test(p)
        };

        return (req, res, next) => {
            try {
                req.requestTime = Date.now();
                const path = req.path;
                const shouldProcess = pathMatcher(path) && !_find(whiteList, (p) => {
                    return path === p
                });

                if (!shouldProcess) {
                    return next();
                }

                const token = Util.getToken(req);

                if (token === undefined) {
                    return Exception.failWith(req, res, new Error(Exception.NO_TOKEN_EXCEPTION));
                }
                const decoded = Token.decode(token);
                // if (Time.isEarlierThanNow(decoded.exp)) {
                //     return Exception.failWith(req, res, new Error(Exception.EXPIRED_TOKEN_EXCEPTION));
                // }

                // TODO: Create another middleware to check if the logged in user tries to edit something that belongs to him
                req.session = {};
                req.session.user = decoded.user;


                return next();
            } catch (err) {
                console.log(err)
                return Exception.failWith(req, res, err);
            }

        };
    }
}