import DB from './../../helpers/db';



export default class LeadController {
    static create(lead) {
        return DB("lead").insert(lead).then(data => { 
             return {message:"lead created sucessfully"}    
        }).catch((err) => {
            throw err;
        });
    }
}