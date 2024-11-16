import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import FcmTokenService from './../../helpers/fcmtoken'

export default class TeamLocationController {
    
    static sendNotification(req, res) {
        FcmTokenService.sendNotification()
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