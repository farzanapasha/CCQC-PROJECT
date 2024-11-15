
import DB from './../../helpers/db';



export default class UserController {
    static create(user) {
        return DB("user").insert(user).then(data => { 
             return {message:"user created sucessfully"}    
        }).catch((err) => {
            throw err;
        });
    }
}