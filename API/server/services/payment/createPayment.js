import DB from './../../helpers/db';
import _ from 'lodash';


export default class PaymentController {
    static create(payment) {
        return DB("payment").insert(payment).then(data => {
            let paiedAmount = 0
            let pendingAmount = 0
            return DB("invoice")
                .leftJoin("invoiceitemmapping", `invoice.id`, '=', 'invoiceitemmapping.invoice_id')
                .leftJoin("item", "item.id", "=", "invoiceitemmapping.item_id")
                .leftJoin("payment",
                    function () {
                        this.on("payment.invoice_id", "=", "invoice.id")
                            .onIn('payment.deleted', '=', [false])
                    })
                .where('invoice.id', '=', payment.invoice_id)
                .andWhere({ 'invoice.deleted': false })
                .select('invoice.id', 'rate', "payment.amount", "payment.id as payment_id").then(data => {
                    _.map(_.groupBy(data, item => item.id), (value, key) => {
                        paiedAmount = _.sum(_.map(_.uniqBy(value, 'payment_id'), item => _.toNumber(item.amount)))
                        pendingAmount = value[0].rate - paiedAmount
                    })
                    if(paiedAmount===0){
                        return DB("invoice").where('id', '=', returndata[0].invoice_id)
                        .update({ status: "draft" }).then(data => { 
                            return { message: resMessage };
                        })
                    }
                    else if (pendingAmount > 0) {
                        //partial
                        return DB("invoice").where('id', '=', payment.invoice_id)
                            .update({ status: "partialy paid" }).then(data => {
                                return { message: "payment created sucessfully" }

                             })
                    }
                    else {
                        //paid
                        return DB("invoice").where('id', '=', payment.invoice_id)
                            .update({ status: "paid" }).then(data => { 
                                return { message: "payment created sucessfully" }

                            })

                    }
                })
        }).catch((err) => {
            console.log(err)
            throw err;
        });
    }
}