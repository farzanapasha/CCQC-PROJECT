import _ from 'lodash';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import DB from './../../helpers/db';

export default class TeamController {

    static update(id, input) {
        if (input.name || input.description) {
            let teamInput = _.pick(input, ["name", "description", "modifiedby"])
            return DB("team").where('id', '=', id)
                .update(teamInput).then(data => {
                    if (input.members) {
                        let teamMappingBatch = _.map(input.members, item => {
                            return { team_id: id, user_id: item,createdby:input.modifiedby, modifiedby: input.modifiedby }
                        })
                        var chunkSize = 30;
                        return DB("teamusermapping").where('team_id', '=', id)
                            .del().then(deletedmapping => {

                                return DB.batchInsert('teamusermapping', teamMappingBatch, chunkSize)
                                    .returning('id')
                                    .then(ids => {
                                        return { message: "team updated sucessfully" }
                                    })

                            })
                    }
                    else {
                        return { message: "team updated sucessfully" }
                    }
                }).catch((err) => {
                    console.log(err)
                    throw err;
                });
        }
        else if (input.members) {

            var chunkSize = 30;
            return DB("team").where('id', '=', id).then(teamdata => {
                let teamMappingBatch = _.map(input.members, item => {
                    return { team_id: id, user_id: item, modifiedby: input.modifiedby, created_by: teamdata[0].created_by }
                })
                return DB("teamusermapping").where('team_id', '=', id)
                    .del().then(deletedmapping => {
                        return DB.batchInsert('teamusermapping', teamMappingBatch, chunkSize)
                            .returning('id')
                            .then(ids => {
                                return { message: "team updated sucessfully" }
                            })

                    })
            })
        }
        else {
            return Promise.resolve().then(() => {
                return { message: "please provide update data" }
            })
        }

    }

}