import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import ScheduleService from './../../services/schedule'

export default class ScheduleController {
    static create(req, res) {
        const schedule = Object.assign({
        }, _pick(req.body, ['workorder_id', 'team_id', 'client_id','status', 'startdate',
        'enddate','description','equipment_id',"type_id","job_name"]), {
            'createdby': req.session.user.email,
        });
        const rules = {"workorder_id":"required",
        "team_id":"required",
        "client_id":"required",
        "status":"required",
        "startdate":"required",
        "enddate":"required",
        "equipment_id":"required",
        "type_id":"required",
        }
        Validator.run(schedule, rules).then(() => {
            return ScheduleService.createSchedule.create(schedule)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}