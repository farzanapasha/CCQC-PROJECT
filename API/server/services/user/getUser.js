import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class UserController {
static getUser(id) {
    return DB("user").join('role', 'user.role_id', '=', 'role.id').where('user.deleted', '=', false).andWhere('user.id', '=', id).select('user.email', 'role.name as role',
    'user.name','user.gender','user.phone',"user.id","role.id as role_id").then(data => { 
        return data[0]
   }).catch((err) => {
       console.log(err)
       throw new Error(err.message);
   });
}
}
