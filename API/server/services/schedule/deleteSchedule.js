
import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class ScheduleController {

    static delete(id) {
        return DB("schedule") .where('id', '=', id)
        .del().then(data => { 
            return {message:"schedule deleted sucessfully"}    
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}