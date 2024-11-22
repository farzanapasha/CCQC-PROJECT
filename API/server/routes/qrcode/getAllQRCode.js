import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import QRCodeService from './../../services/qrcode'

export default class QRCodeController {
    
    static getAll(req, res) {
        QRCodeService.getAllQRCode.getAll()
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