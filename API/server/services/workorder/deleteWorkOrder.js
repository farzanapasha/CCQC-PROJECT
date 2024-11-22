
import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class WorkOrderController {

    static delete(id) {
        return DB("workorder").where('id', '=', id)
        .update({deleted:true}).then(data => { 
            return {message:"work deleted sucessfully"}    
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}