
import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import _ from 'lodash'

export default class RoleController {
    static getAll() {
        return DB("teamlocation").join("team","team.id","=","teamlocation.team_id")
        .select('teamlocation.id','name','latitude','longitude').then(data => { 
            return data;
       }).catch((err) => {
           console.log(err)
           throw new Error(err.message);
       });
    }
}