
import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class RoleController {
    static getAll() {
        return DB("role").select('id','name').then(data => { 
            return data
       }).catch((err) => {
           throw new Error(err.message);
       });
    }
}