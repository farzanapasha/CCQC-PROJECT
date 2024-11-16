import DB from './../../helpers/db';



export default class ClientController {
    static create(client) {
        return DB("client").insert(client).then(data => { 
             return {message:"client created sucessfully"}    
        }).catch((err) => {
            throw err;
        });
    }
}