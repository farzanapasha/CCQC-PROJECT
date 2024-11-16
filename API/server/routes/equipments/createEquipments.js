import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import EquipmentService from './../../services/equipments'

export default class EquipmentController {
    static create(req, res) {
        const equipment = Object.assign({
        }, _pick(req.body, ['name']), {
            'createdby': req.session.user.email
                });
        const rules = {"name":"required"}
        Validator.run(equipment, rules).then(() => {
            return EquipmentService.createEquipments.create(equipment)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}