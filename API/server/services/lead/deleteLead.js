
import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class LeadController {

    static delete(id) {
        return DB("lead") .where('id', '=', id)
        .update({deleted:true}).then(data => { 
            let resMessage = "Lead deleted sucessfully";
            if (data === 0) {
                resMessage = `Lead not found for ID: ${id}`
            }
            return { message: resMessage };  
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}