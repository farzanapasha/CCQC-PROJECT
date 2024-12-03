import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import moment from 'moment'

export default class InvoiceController {
    static getAll() {
        return DB("invoice")
            .leftJoin("invoiceitemmapping", `invoice.id`, '=', 'invoiceitemmapping.invoice_id')
            .leftJoin("item", "item.id", "=", "invoiceitemmapping.item_id")
            .leftJoin("client","client.id","=","invoice.client_id")
            .leftJoin("payment",
            function() {
                this.on("payment.invoice_id","=","invoice.id")
                .onIn('payment.deleted', '=', [false])
           })
            .leftJoin("workorder", "workorder.id", "=", "invoice.workorder_id")
            .andWhere({ 'invoice.deleted': false })
            .select('invoice.id', "client.name as clientName",'invoice.status', 'invoice.createdon', 'workorder.createdon as workordercreatedon', 'payment.createdon as paymentcreatedon', 'workorder_id', 'invoice.client_id', 'invoice.discount',
                'rate', 'tax', "item.name as itemName", "item.id as itemId",
                "invoiceitemmapping.quantity as itemQuantity", "invoiceitemmapping.amount as itemAmount", "payment.amount", "payment.id as payment_id").then(data => {
                    return _.map(_.groupBy(data, item => item.id), (value, key) => {
                        return {
                            "id": key,
                            "idDisplay": "#INV"+moment(value[0].createdon).format('YYYY')+moment(value[0].createdon).format('MM')+key,
                            "status": value[0].status,
                            "workorder_id": value[0].workorder_id,
                            "workorder_idDisplay":"#WDL"+moment(value[0].workordercreatedon).format('YYYY')+moment(value[0].workordercreatedon).format('MM')+ value[0].workorder_id,
                            "client_id": value[0].client_id,
                            "clientName":value[0].clientName,
                            "description": value[0].description,
                            "discount": value[0].discount,
                            "rate": value[0].rate,
                            "tax": value[0].tax,
                            "createdon": value[0].createdon,
                            "paymentIds": _.compact(_.uniq(_.map(value, item=>{
                                if(_.compact([item.payment_id]).length){
                                return {
                                    id:item.payment_id,
                                    idDisplay:"#WIP" + moment(item.paymentcreatedon).format('YYYY') + moment(item.paymentcreatedon).format('MM') + item.payment_id
                                }
                            }
                            else{
                                return null
                            }
                        }))),
                            "paiedAmount": _.round(_.sum(_.map(_.uniqBy(value, 'payment_id'), item => _.toNumber(item.amount))),2),
                            "pendingAmount": _.round(value[0].rate - _.sum(_.map(_.uniqBy(value, 'payment_id'), item => _.toNumber(item.amount))),2),
                            "items": _.compact(_.map(_.uniqBy(value,"itemId"), item => {
                                if (_.compact([item.itemName, item.itemId, item.itemQuantity, item.itemAmount]).length) {
                                    return {
                                        "itemName": item.itemName,
                                        "itemId": item.itemId,
                                        "itemQuantity": item.itemQuantity,
                                        "itemAmount": item.itemAmount
                                    }
                                }
                                else {
                                    return null;
                                }
                            }))
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                    throw err;
                });
    }
}