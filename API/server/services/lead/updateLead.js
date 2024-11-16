import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import DB from './../../helpers/db';

export default class LeadController {

    static update(id,input) {
        return DB("lead") .where('id', '=', id)
        .update(input).then(data => { 
            let resMessage = "Lead updated sucessfully";
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