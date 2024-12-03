import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import TeamLocationService from './../../services/teamlocation'

export default class TeamLocationController {
    static create(req, res) {
        const location = Object.assign({
        }, _pick(req.body, ['team_id',"latitude","longitude"]), {
            'createdby': req.session.user.email
                });
        const rules = {"team_id":"required",
        "latitude":"required",
        "longitude":"required"}
        Validator.run(location, rules).then(() => {
            return TeamLocationService.createTeamLocation.create(location)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}