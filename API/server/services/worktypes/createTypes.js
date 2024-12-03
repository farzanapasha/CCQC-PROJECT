import DB from './../../helpers/db';


export default class TypeController {
    static create(types) {
        return DB("scheduletype").insert(types).then(data => { 
             return {message:"type created sucessfully"}    
        }).catch((err) => {
            throw err;
        });
    }
}