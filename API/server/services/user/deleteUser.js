
import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class UserController {

    static delete(id,input) {
        return DB("user") .where('id', '=', id)
        .update({deleted:true}).then(data => { 
            return {message:"user deleted sucessfully"}    
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}