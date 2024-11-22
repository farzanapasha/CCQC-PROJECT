import DB from './../../helpers/db';
import _ from 'lodash'

import FCMService from './../../helpers/fcmtoken'

export default class ScheduleController {
    static create(schedule) {
        return DB("schedule").insert(schedule).then(data => {
            return DB("fcmtoken").then(tokenData => {
                let fcmdata = {
                    "type": 1,
                    "title": "schedule",
                    "body": "schedule crested for a workorder",
                    "workorder_id": schedule.workorder_id,
                    "client_id": schedule.client_id
                }
                let fcmtoken = _.map(tokenData, "token")
                return FCMService.sendNotification(fcmdata, fcmtoken).then(fcmreturndata => {
                    return { message: "schedule created sucessfully" }

                }).catch(err => {
                    return { message: "schedule created sucessfully" }
                })
            }).catch(err => {
                return { message: "schedule created sucessfully" }
            })
        }).catch((err) => {
            console.log(err)
            throw err;
        });
    }
}