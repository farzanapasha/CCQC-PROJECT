import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import moment from 'moment'


export default class WorkOrderController {
static getWorkOrder(id) {
     return DB("workorder")
    .leftJoin("schedule", 'schedule.workorder_id', '=', 'workorder.id')
    .leftJoin("invoice", 'invoice.workorder_id', '=', 'workorder.id')
    .leftJoin("team", 'schedule.team_id', '=', 'team.id')
    .leftJoin("client", 'workorder.client_id', '=', 'client.id')
    .leftJoin("equipment",'schedule.equipment_id', '=', 'equipment.id')
    .leftJoin("scheduletype",'schedule.type_id', '=', 'scheduletype.id')
    .leftJoin("workorderstatus",'workorder.status_id', '=', 'workorderstatus.id')
    .where('workorder.id', '=', id)
    .andWhere('workorder.deleted', '=', false)
    .select('workorder.id', 'workorder.client_id','workorder.createdon',"invoice.createdon as invoicecreatedon",
    "invoice.id as invoice_id","client.name as clientName","client.location as clientLocation",
        'workorder.location', 'workorder.description', 'workorder.type', 'workorder.status_id',
         'schedule.team_id','schedule.id as schedule_id',"schedule.description as scheduleDescription",
          "schedule.startdate", "schedule.enddate", "team.name","equipment.name as equipmentName",
           "scheduletype.name as typeName","workorderstatus.name as statusName","invoice.deleted as deletedInvoice").then(data => {
            return _.map(_.groupBy(data, item => item.client_id + "#" + item.id), (value,key) => {
                return {
                    workOrderId:key.split("#")[1],
                    workOrderIdDisplay:"#WDL"+moment(value[0].createdon).format('YYYY')+moment(value[0].createdon).format('MM')+key.split("#")[1],
                    clientId:key.split("#")[0],
                    location:value[0].location,
                    description:value[0].description,
                    type:value[0].type,
                    status_id:value[0].status_id,
                    statusName:value[0].statusName,
                    clientName:value[0].clientName,
                    clientLocation:value[0].clientLocation,
                    createdon:value[0].createdon,
                    invoice:_.uniqBy(_.compact(_.map(value,item=>{
                        if(_.compact([item.invoice_id]).length&& !item.deletedInvoice){
                        return {
                            invoice_id:item.invoice_id,
                            invoice_idDisplay:"#INV"+moment(item.invoicecreatedon).format('YYYY')+moment(item.invoicecreatedon).format('MM')+item.invoice_id,

                        }}
                        else{
                         return null;
                        }
                    })),"invoice_id"),
                    schedule:  _.uniqBy(_.compact(_.map(value,item=>{
                        if(_.compact([item.startdate,item.enddate,item.name,
                            item.team_id,item.schedule_id,item.subject]).length){
                        return {
                            startDate:item.startdate,
                            endDate:item.enddate,
                            teamName:item.name,
                            teamId:item.team_id,
                            schedule_id:item.schedule_id,
                            description:item.scheduleDescription,
                            equipmentName:item.equipmentName,
                            typeName:item.typeName
                        }}
                        else{
                         return null;
                        }
                    })),"schedule_id"),

                }
            })
        }).catch((err) => {
       console.log(err)
       throw new Error(err.message);
   });
}
}
