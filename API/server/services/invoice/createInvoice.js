import _pick from 'lodash/pick';

import DB from './../../helpers/db';

export default class InvoiceController {
    static create(invoice) {
        let invoiceItems = invoice.item;
        delete invoice.item;
        return DB("invoice").returning('id').insert(invoice).then(data => {
            if(invoiceItems.length){
                invoiceItems.forEach(element => {
                    element.invoice_id = data[0];
                    element.createdby = invoice.createdby;
                    delete element.id
                });
                var chunkSize = 30;
                return DB.batchInsert("invoiceitemmapping",invoiceItems,chunkSize).then(itemdata => {
                    return {message:"invoice created sucessfully"}  
                });
            }
             return {message:"invoice created sucessfully"}    
        }).catch((err) => {
            console.log(err)
            throw err;
        });
    }
}