import DB from './../../helpers/db';
import LeadService from './../lead'



export default class ClientController {
    static convert(id, email) {
        return LeadService.getLead.getLead(id).then(leadData => {
            if (leadData) {
                leadData.createdby = email
                delete leadData.id
                return DB("client").insert(leadData).then(data => {
                    return { message: "lead converted to client sucessfully" }
                }).catch((err) => {
                    console.log(err)
                    throw err;
                });
            }
            else {
                return { message: `Lead not found for ID: ${id}` }
            }
        })
    }
}