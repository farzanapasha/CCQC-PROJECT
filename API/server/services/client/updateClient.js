import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import DB from './../../helpers/db';

export default class ClientController {

    static update(id, input) {
        return DB("client").where('id', '=', id)
            .update(input).then(data => {
                let resMessage = "Client updated sucessfully";
                if (data === 0) {
                    resMessage = `Client not found for ID: ${id}`
                }
                return { message: resMessage };
            }).catch((err) => {
                console.log(err)
                throw err;
            });
    }

}