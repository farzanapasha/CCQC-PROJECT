
import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class InvoiceController {

    static delete(id) {
        return DB("invoice") .where('id', '=', id)
        .update({deleted:true}).then(data => {
            let resMessage = "Invoice deleted sucessfully";
            if (data === 0) {
                resMessage = `Invoice not found for ID: ${id}`
            }
            return { message: resMessage };  
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}