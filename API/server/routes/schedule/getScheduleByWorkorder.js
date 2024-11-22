import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import ScheduleService from './../../services/schedule'

export default class ScheduleController {
static getSchedule(req, res) {
    const {
        id
    } = req.query;
    const rules = {
        id: 'required'
    };
    Validator.run({
        id
    }, rules).then(() => {
        return ScheduleService.getScheduleByWorkorder.getSchedule(id);
    }).then((result) => {
        res.status(200).json({
            data: result
        });
    }).catch((err) => {
        Exception.failWith(req, res, err);
    });
}
}
