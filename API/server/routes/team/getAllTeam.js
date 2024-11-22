import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import TeamService from './../../services/team'

export default class TeamController {
    
    static getAll(req, res) {
        TeamService.getAllTeam.getAll()
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