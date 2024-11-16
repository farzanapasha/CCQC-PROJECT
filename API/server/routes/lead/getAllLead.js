import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import LeadService from './../../services/lead'

export default class LeadController {
    
    static getAll(req, res) {
        LeadService.getAllLead.getAll()
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