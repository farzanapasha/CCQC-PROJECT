import DB from './../../helpers/db';

export default class WorkOrderController {
    static create(work) {
        return DB("workorder").insert(work).then(data => { 
             return {message:"work created sucessfully"}    
        }).catch((err) => {
            console.log(err)
            throw err;
        });
    }
}