import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import moment from 'moment'
import _ from 'lodash'

export default class PaymentController {
static getPayment(id) {
    return DB("payment")
    .leftJoin("invoice", 'invoice.id', '=', 'payment.invoice_id')
    .where('payment.client_id', '=', id).andWhere({'payment.deleted':false}).select('payment.id','invoice_id', 'payment.client_id', 'payment.memo', 'amount','paymode',
    'recive_date', 'payment.createdon','invoice.createdon as invoicecreatedon','invoice.status as invoiceStatus').then(data => {
        return _.map(data, item => {
            return {
                'id': item.id,
                'idDisplay': "#WIP" + moment(item.createdon).format('YYYY') + moment(item.createdon).format('MM') + item.id,
                'invoice_id':item.invoice_id,
                'invoice_idDisplay': "#INV"+moment(item.invoicecreatedon).format('YYYY')+moment(item.invoicecreatedon).format('MM')+item.invoice_id,
                'client_id': item.client_id,
                'invoiceStatus':item.invoiceStatus,
                'memo': item.memo,
                'amount': _.round(item.amount,2),
                'paymode': item.paymode,
                'recive_date': item.recive_date,
                'createdon': item.createdon
            }
        })
   }).catch((err) => {
       console.log(err)
       throw new Error(err.message);
   });
}
}
