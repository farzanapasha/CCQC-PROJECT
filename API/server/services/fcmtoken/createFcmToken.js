import DB from './../../helpers/db';
import _ from 'lodash'

export default class EquipmentController {
    static create(token) {
        return DB("fcmtoken").where({ user_id: token.user_id }).then(data => {
            if (data.length > 0) {
                let input = _.pick(token, ["token"])
                return DB("fcmtoken").where('user_id', '=', token.user_id)
                    .update(input).then(updatedata => {
                        return { message: "token saved sucessfully" }
                    })
            }
            else {
                return DB("fcmtoken").insert(token).then(insertdata => {
                    return { message: "token saved sucessfully" }
                })
            }
        }).catch((err) => {
            console.log(err)
            throw err;
        });
    }
}