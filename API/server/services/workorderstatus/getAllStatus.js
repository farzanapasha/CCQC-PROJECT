
import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import _ from 'lodash'

export default class StatusController {
    static getAll() {
        return DB("workorderstatus").select('id','name').then(data => { 
            return _.map(data,item=>{
                return {label:item.name,value:item.id}
            })
       }).catch((err) => {
           throw new Error(err.message);
       });
    }
}