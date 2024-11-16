import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class DashboardController {
    static getInvoiceAndWorkorder() {
        return DB("workorder").count('id as a').then(totalwork => {
            return DB("workorder").count('id as a').where({status_id:1}).then(unscheduledwork => {
                return DB("invoice").count('id as a').then(totalinv => {
                    return DB("invoice").count('id as a').where({status:"paid"}).then(paidinv => {
        // return DB.raw("SELECT COUNT(*) as data from workorder WHERE status_id ='1' union SELECT COUNT(*) from workorder union  SELECT COUNT(*) from invoice  union SELECT COUNT(*) from invoice WHERE status ='paid';").then(data => {
            return {
                unScheduledWorkorder: unscheduledwork[0].a,
                totalWorkorder: totalwork[0].a,
                totalInvoice: totalinv[0].a,
                paidInvoice: paidinv[0].a
            }
        })
    })
})
        }).catch(err => {
            console.log(err)
        })
    }
}