import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class LeadController {
    static getAll() {
        return DB("lead").where('deleted', '=', false).select('id','email',
        'name','gender','phone','phonecode','status','source','service','location').then(data => { 
            return data
       }).catch((err) => {
           throw new Error(err.message);
       });
    }
}