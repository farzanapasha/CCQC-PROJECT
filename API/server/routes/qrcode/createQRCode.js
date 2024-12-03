import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import QRCodeService from './../../services/qrcode'

export default class WorkorderStatusController {
    static create(req, res) {
        const qr = Object.assign({
        }, _pick(req.body, ["serial_no","description","model_no","workorder_id",
        "equipment_id","team_id","dateandtime","client_id"]), {
            'createdby': req.session.user.email
        });
        const rules = {"serial_no":"required",
        "description":"required",
        "model_no":"required",
        "workorder_id":"required",
        "client_id":"required",
        "equipment_id":"required",
        "team_id":"required",
        "dateandtime":"required"}
        Validator.run(qr, rules).then(() => {
            return QRCodeService.createQRCode.create(qr)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}