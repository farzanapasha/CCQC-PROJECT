import DB from './../../helpers/db';
import _ from 'lodash'

export default class EquipmentController {
    static create(location) {
        return DB("teamlocation").where({ team_id: location.team_id }).then(data => {
            if (data.length > 0) {
                let input = _.pick(location, ["latitude", 'longitude'])
                return DB("teamlocation").where('team_id', '=', location.team_id)
                    .update(input).then(updatedata => {
                        return { message: "location updated sucessfully" }
                    })
            }
            else {
                return DB("teamlocation").insert(location).then(insertdata => {
                    return { message: "location created sucessfully" }
                })
            }
        }).catch((err) => {
            throw err;
        });
    }
}