import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import FcmTokenService from './../../services/fcmtoken'

export default class TeamLocationController {
    
    static getAll(req, res) {
        FcmTokenService.getAllFcmToken.getAll()
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