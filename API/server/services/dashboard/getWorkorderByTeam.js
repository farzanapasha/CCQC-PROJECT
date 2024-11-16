import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import moment from 'moment';

export default class DashboardController {
    static getWorkorderByTeam() {
        let today = new Date().toISOString().slice(0, 10)
        let startDate = `${today}T00:00:00.000Z`;
        let endDate = `${today}T23:59:59.000Z`;
            return DB('schedule').where('startdate', '>=', startDate)
            .andWhere('enddate', '<=',  endDate)
            .leftJoin("client","schedule.client_id","=","client.id")
            .leftJoin("workorder","schedule.workorder_id","=",'workorder.id')
            .select("client.name as clientName", "client.id as clientId",
            "schedule.job_name as jobName", "schedule.startdate as startDate", 
            "schedule.enddate as endDate", "schedule.workorder_id as workOrderId",
            "schedule.team_id as teamId","workorder.createdon as createdon").then(workorderData => {
                // return workorderData;
                return _.map(workorderData, item=>{
                    return {
                        workOrderId:item.workOrderId,
                        workOrderIdDisplay:"#WDL"+moment(item.createdon).format('YYYY')+moment(item.createdon).format('MM')+item.workOrderId,
                        clientName:item.clientName,
                        jobName:item.jobName,
                        startDate:item.startDate,
                        endDate:item.endDate,
                        teamId:item.teamId,
                        clientId:item.clientId
                }
                })
        }).catch(err => {
            console.log(err)
        })
    }
}