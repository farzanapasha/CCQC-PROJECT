
import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import _ from 'lodash'

export default class RoleController {
    static getAll() {
        return DB("fcmtoken").join("user","user.id","=","fcmtoken.user_id")
        .select('fcmtoken.id','user.name','fcmtoken.token').then(data => { 
            return data;
       }).catch((err) => {
           console.log(err)
           throw new Error(err.message);
       });
    }
}