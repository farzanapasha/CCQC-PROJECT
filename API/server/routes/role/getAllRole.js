import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import RoleService from './../../services/role'

export default class RoleController {
    
    static getAll(req, res) {
        RoleService.getAllRole.getAll()
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