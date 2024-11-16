import DB from './../../helpers/db';

export default class EquipmentController {
    static create(equipment) {
        return DB("equipment").insert(equipment).then(data => { 
             return {message:"equipment created sucessfully"}    
        }).catch((err) => {
            throw err;
        });
    }
}