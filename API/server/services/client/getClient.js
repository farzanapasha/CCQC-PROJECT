import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class ClientController {
static getClient(id) {
    return DB("client").where('deleted', '=', false).andWhere('id', '=', id).select('id','email',
    'name','gender','phone','phonecode','status','source','service','location').then(data => { 
        return data[0]
   }).catch((err) => {
       console.log(err)
       throw new Error(err.message);
   });
}
}
