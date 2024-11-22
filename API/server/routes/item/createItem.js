import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import ItemService from './../../services/item'

export default class EquipmentController {
    static create(req, res) {
        const item = Object.assign({
        }, _pick(req.body, ['name']), {
            'createdby': req.session.user.email
                });
        const rules = {"name":"required"}
        Validator.run(item, rules).then(() => {
            return ItemService.createItem.create(item)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}