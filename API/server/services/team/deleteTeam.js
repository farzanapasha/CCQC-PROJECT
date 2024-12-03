import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class TeamController {

    static delete(id) {
        return DB("teamusermapping") .where('team_id', '=', id)
        .del().then(datamapping => { 
            return DB("team") .where('id', '=', id)
        .del().then(data => {
            return {message:"team deleted sucessfully"}  
        })  
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}