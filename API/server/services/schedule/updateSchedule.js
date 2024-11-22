import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import DB from './../../helpers/db';

export default class ScheduleController {

    static update(id,input) {
        return DB("schedule") .where('id', '=', id)
        .update(input).then(data => { 
            return {message:"scedule updated sucessfully"}    
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}