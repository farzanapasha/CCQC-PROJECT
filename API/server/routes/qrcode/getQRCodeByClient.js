import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import QRCodeService from './../../services/qrcode'

export default class QRCodeController {
static getQRCodeByClient(req, res) {
    const {
        id
    } = req.query;
    const rules = {
        id: 'required'
    };
    Validator.run({
        id
    }, rules).then(() => {
        return QRCodeService.getQRCodeByClient.getQRCodeByClient(id);
    }).then((result) => {
        res.status(200).json({
            data: result
        });
    }).catch((err) => {
        Exception.failWith(req, res, err);
    });
}
}
