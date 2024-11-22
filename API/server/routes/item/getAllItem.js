import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import ItemService from './../../services/item'

export default class RoleController {
    
    static getAll(req, res) {
        ItemService.getAllItem.getAll()
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