import DB from './../../helpers/db';

export default class ItemController {
    static create(item) {
        return DB("item").insert(item).then(data => { 
             return {message:"item created sucessfully"}    
        }).catch((err) => {
            throw err;
        });
    }
}