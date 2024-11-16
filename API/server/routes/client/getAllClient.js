import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import ClientService from './../../services/client'

export default class ClientController {
    
    static getAll(req, res) {
        ClientService.getAllClient.getAll()
            .then((result) => {
                res.status(200).json({
                    data: result
                });
            })
            .catch((err) => {
                Exception.failWith(req, res, err);
            });
    }
}