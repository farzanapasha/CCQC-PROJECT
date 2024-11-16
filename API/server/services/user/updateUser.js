import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import DB from './../../helpers/db';

export default class UserController {

    static update(id,input) {
        return DB("user") .where('id', '=', id)
        .update(input).then(data => { 
            return {message:"user updated sucessfully"}    
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}