import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class DashboardController {
    static getLeadWorkorderCount(startDate, endDate) {
        let today = new Date().toISOString().slice(0, 10)
        if (!startDate) {
            startDate = today;
        }
        if (!endDate) {
            endDate = today;
        }
        return DB('lead').select("id").where('createdon', '>=', startDate)
        .andWhere('createdon', '<=',  endDate).then(leadData => {
            return DB('workorder').select().whereBetween("createdon", [startDate, endDate]).then(workorderData => {
                return DB('lead').count('id as leadCount').then(data => {

                    return {
                        totalLeads: data[0].leadCount,
                        leadCount: leadData.length,
                        workorderCount: workorderData.length
                    };
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
}