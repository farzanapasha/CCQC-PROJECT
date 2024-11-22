import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import DB from './../../helpers/db';

export default class InvoiceController {

    static update(id, input) {
        let invoiceItems = input.item;
        delete input.item;
        if (Object.keys(input).length > 1) {
            return DB("invoice").where('id', '=', id)
                .update(input).then(data => {
                    if (data === 0) {
                        return { message: `Invoice not found for ID: ${id}` }
                    }
                    if (invoiceItems && invoiceItems.length) {
                        invoiceItems.forEach(element => {
                            element.invoice_id = id;
                            element.createdby = input.modifiedby;
                            element.modifiedby = input.modifiedby;
                            delete element.id
                        });
                        var chunkSize = 30;
                        return DB("invoiceitemmapping").where('invoice_id', '=', id)
                            .del().then(deletedmapping => {
                                return DB.batchInsert('invoiceitemmapping', invoiceItems, chunkSize)
                                    .returning('id')
                                    .then(ids => {
                                        return { message: "Invoice updated sucessfully" }
                                    })
                            })
                    } else {
                        return { message: "Invoice updated sucessfully" };
                    }

                }).catch((err) => {
                    console.log(err)
                    throw err;
                });
        } else if (invoiceItems && invoiceItems.length) {
            return DB("invoice").where('id', '=', id).then(invoiceData => {
                invoiceItems.forEach(element => {
                    element.invoice_id = id;
                    element.createdby = invoiceData[0].createdby;
                    element.modifiedby = input.modifiedby;
                    delete element.id
                });
                var chunkSize = 30;
                return DB("invoiceitemmapping").where('invoice_id', '=', id)
                    .del().then(deletedmapping => {
                        return DB.batchInsert('invoiceitemmapping', invoiceItems, chunkSize)
                            .returning('id')
                            .then(ids => {
                                return { message: "Invoice updated sucessfully" }
                            })
                    })
            })
        } else {
            return Promise.resolve().then(() => {
                return { message: "Provide data for Invoice update" }
            })
        }
    }

}