import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import TeamLocationService from './../../services/teamlocation'

export default class TeamLocationController {
    
    static getAll(req, res) {
        TeamLocationService.getAllTeamLocation.getAll()
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