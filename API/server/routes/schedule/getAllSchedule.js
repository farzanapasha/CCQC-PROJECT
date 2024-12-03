import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import ScheduleService from './../../services/schedule'

export default class ScheduleController {
    
    static getAll(req, res) {
        ScheduleService.getAllSchedule.getAll()
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