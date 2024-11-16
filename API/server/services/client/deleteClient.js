
import Exception from './../../helpers/exception';

import DB from './../../helpers/db';

export default class ClientController {

    static delete(id) {
        return DB("client").where('id', '=', id)
            .update({ deleted: true }).then(data => {
                let resMessage = "Client deleted sucessfully";
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