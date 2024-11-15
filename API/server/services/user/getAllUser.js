import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class UserController {
    static getAll() {
        return DB("user")
        .join('role', 'user.role_id', '=', 'role.id')
        .where('user.deleted', '=', false)
        .andWhere("user.email","!=","admin@eletech.com")
        .select('user.email', 'role.name as role',
        'user.name','user.gender','user.phone',"user.id","role.id as role_id").then(data => { 
            return data
       }).catch((err) => {
           throw new Error(err.message);
       });
    }
}