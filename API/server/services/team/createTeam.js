import _ from 'lodash';

import DB from './../../helpers/db';

export default class TeamController {
    static create(team) {
        let teamTable = _.pick(team, ["name", "description","createdby"])
        return DB("team").returning('id').insert(teamTable).then(data => {
            if (team.members.length > 0) {
                let teamMappingBatch = _.map(team.members, item => {
                    return { team_id: data[0], user_id: item,createdby:team.createdby}
                })
                var chunkSize = 30;
                return DB.batchInsert('teamusermapping', teamMappingBatch, chunkSize)
                    .returning('id')
                    .then(id => {
                        return { message: "team created sucessfully" }
                    })
            }
            else{
                return { message: "team created sucessfully" }
            }
        }).catch((err) => {
            console.log(err)
            throw err;
        });
    }
}