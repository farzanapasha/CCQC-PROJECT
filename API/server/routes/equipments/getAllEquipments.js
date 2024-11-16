import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import EquipmentService from './../../services/equipments'

export default class RoleController {
    
    static getAll(req, res) {
        EquipmentService.getAllEquipments.getAll()
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