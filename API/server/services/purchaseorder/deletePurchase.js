import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class TeamController {

    static delete(id) {
        return DB("purchasebill") .where('purchase_id', '=', id)
        .del().then(datamapping => { 
            return DB("purchaseorder") .where('id', '=', id)
        .del().then(data => {
            return {message:"purchase deleted sucessfully"}  
        })  
       }).catch((err) => {
           console.log(err)
           throw err;
       });
    }

}