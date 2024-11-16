import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import FcmTokenService from './../../services/fcmtoken'

export default class TeamLocationController {
    static create(req, res) {
        const token = Object.assign({
        }, _pick(req.body, ['user_id',"token"]), {
            'createdby': req.session.user.email
                });
        const rules = {"user_id":"required",
        "token":"required"}
        Validator.run(token, rules).then(() => {
            return FcmTokenService.createFcmToken.create(token)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}