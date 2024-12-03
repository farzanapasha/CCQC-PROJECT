import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import TypeService from './../../services/worktypes'

export default class RoleController {
    
    static getAll(req, res) {
        TypeService.getAllTypes.getAll()
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