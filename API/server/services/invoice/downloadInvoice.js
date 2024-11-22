import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import PDFGenerator from './../../helpers/pdfgenerator'
import moment from "moment"
import numeral from 'numeral'

export default class InvoiceController {
    static download(id) {
        return DB("invoice")
            .leftJoin("invoiceitemmapping", `invoice.id`, '=', 'invoiceitemmapping.invoice_id')
            .leftJoin("item", "item.id", "=", "invoiceitemmapping.item_id")
            .leftJoin("client", "client.id", "=", "invoice.client_id")
            .leftJoin("payment",
            function() {
                this.on("payment.invoice_id","=","invoice.id")
                .onIn('payment.deleted', '=', [false])
           }).leftJoin("workorder", "workorder.id", "=", "invoice.workorder_id")
            .where('invoice.id', '=', id)
            .andWhere({ 'invoice.deleted': false })
            .select('invoice.id', 'invoice.status', 'workorder_id', 'invoice.discount', 'invoice.createdon',  'workorder.createdon as workordercreatedon',
                 'rate', 'tax', "item.name as itemName", "item.id as itemId",
                'client.id as clientId', 'client.name as clientName', 'client.email as clientEmail', 'client.phone as clientPhone', 'client.location as clientLocation',
                "invoiceitemmapping.quantity as itemQuantity", "invoiceitemmapping.amount as itemAmount",  "payment.amount", "payment.id as payment_id").then(data => {
                    let item =_.map(_.groupBy(data, item => item.id), (value, key) => {
                        let items = _.compact(_.map(_.uniqBy(value,"itemId"), item => {
                            if (_.compact([item.itemName, item.itemId, item.itemQuantity, item.itemAmount]).length) {
                                return {
                                    "itemName": item.itemName,
                                    "itemId": item.itemId,
                                    "itemQuantity": item.itemQuantity,
                                    "itemAmount": item.itemAmount,
                                    "subTotal":item.itemQuantity*item.itemAmount,
                                    "taxAmount":(item.itemQuantity*item.itemAmount)*value[0].tax/100,
                                    "grandTotal":((item.itemQuantity*item.itemAmount)*value[0].tax/100)+(item.itemQuantity*item.itemAmount),
                                    "itemAmountDisplay": numeral(item.itemAmount).format("0,0.00"),
                                    "subTotalDisplay":numeral(item.itemQuantity*item.itemAmount).format("0,0.00"),
                                    "taxAmountDisplay":numeral((item.itemQuantity*item.itemAmount)*value[0].tax/100).format("0,0.00"),
                                    "grandTotalDisplay":numeral(((item.itemQuantity*item.itemAmount)*value[0].tax/100)+(item.itemQuantity*item.itemAmount)).format("0,0.00"),
                                }
                            }
                            else {
                                return null;
                            }
                        }))
                        let totalAmount =_.sum(_.map(items,i=>i.itemQuantity*i.itemAmount))
                        return {
                            "id": key,
                            "idDisplay": "#INV"+moment(value[0].createdon).format('YYYY')+moment(value[0].createdon).format('MM')+key,
                            "status": value[0].status,
                            "workorder_id": value[0].workorder_id,
                            "workIdDisplay":"#WDL"+moment(value[0].workordercreatedon).format('YYYY')+moment(value[0].workordercreatedon).format('MM')+ value[0].workorder_id,
                            "client_id": value[0].clientId,
                            "client_name": value[0].clientName,
                            "client_email": value[0].clientEmail,
                            "client_phone": value[0].clientPhone,
                            "client_location": value[0].clientLocation,
                            "createdOn": moment(value[0].createdon).format("MMM DD, yyyy hh:mm A"),
                            "discount": value[0].discount,
                            "calculatedDiscount": numeral(totalAmount*value[0].discount/100).format("0,0.00"),
                            "rate": value[0].rate,
                            "tax": value[0].tax,
                            "rateDisplay": numeral(value[0].rate).format("0,0.00"),
                            "taxDisplay": numeral(value[0].tax).format("0,0.00"),
                            "calculatedTax":numeral(totalAmount*value[0].tax/100).format("0,0.00"),
                            "totalAmount":numeral(totalAmount).format("0,0.00"),
                            "paiedAmount":numeral(_.sum(_.map(_.uniqBy(value,'payment_id'),item=>_.toNumber(item.amount)))).format("0,0.00"),
                            "pendingAmount":numeral(value[0].rate-_.sum(_.map(_.uniqBy(value,'payment_id'),item=>_.toNumber(item.amount)))).format("0,0.00"),
                            "paid":_.round(value[0].rate,2)-_.sum(_.map(_.uniqBy(value,'payment_id'),item=>_.toNumber(item.amount)))>0?"unpaid":"paid",
                            "items": items
                        }
                    })
return PDFGenerator.generatePDF(item)
                }).catch((err) => {
                    console.log(err)
                    throw err;
                });
    }
}
