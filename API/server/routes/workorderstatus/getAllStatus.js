import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import WorkorderStatusService from './../../services/workorderstatus'

export default class WorkorderStatusController {
    
    static getAll(req, res) {
        WorkorderStatusService.getAllStatus.getAll()
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