import DB from './../../helpers/db';


export default class StatusController {
    static create(types) {
        return DB("workorderstatus").insert(types).then(data => { 
             return {message:"status created sucessfully"}    
        }).catch((err) => {
            throw err;
        });
    }
}