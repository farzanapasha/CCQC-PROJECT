import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import TeamService from './../../services/team'

export default class TeamController {
    static create(req, res) {
        const team = Object.assign({
        }, _pick(req.body, ['name', 'description', 'members']), {
            'createdby': req.session.user.email,
        });
        const rules = {"name":"required",
        "description":"required",
        "members":"required"}
        Validator.run(team, rules).then(() => {
            return TeamService.createTeam.create(team)
        }).then((result) => {
            res.status(200).json({
                data: result
            });
        }).catch((err) => {
            Exception.failWith(req, res, err);
        });
    }

}