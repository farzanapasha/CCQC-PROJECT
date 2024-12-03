import DB from './../../helpers/db';


export default class StatusController {
    static create(types) {
        return DB("qrcode").returning('id').insert(types).then(data => { 
             return {status:"status created sucessfully",
            id:data[0]}    
        }).catch((err) => {
            throw err;
        });
    }
}