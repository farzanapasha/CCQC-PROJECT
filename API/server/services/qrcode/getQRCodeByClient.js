
import Exception from './../../helpers/exception';
import DB from './../../helpers/db';
import _ from 'lodash'

export default class QRCodeController {
    static getQRCodeByClient(id) {
        return DB("qrcode")
        .leftJoin("equipment","equipment.id","=","qrcode.equipment_id")
        .leftJoin("team","team.id","=","qrcode.team_id")
        .where({client_id:id})
        .select("qrcode.id","serial_no","qrcode.description","model_no","workorder_id",
        "equipment_id","team_id","dateandtime","client_id","equipment.name as equipmentName","team.name as teamName").then(data => { 
            return data
       }).catch((err) => {
        console.log(err)
           throw new Error(err.message);
       });
    }
}