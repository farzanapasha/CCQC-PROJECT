import _ from 'lodash';

import Exception from './../../helpers/exception';
import DB from './../../helpers/db';

export default class TeamController {
static getPurchaseByClient(id) {
    return DB("purchasebill")
    .join('purchaseorder', 'purchasebill.purchase_id', '=', 'purchaseorder.id')
    .leftJoin("item",'item.id','=','purchaseorder.item_id').where('purchaseorder.client_id','=',id)
    .select(`item.name as itemName`,`client_id`,`workorder_id`,`quantity`,"purchaseorder.id as purchase_id",
        `description`,`cost`,`tax`,`datecreated`,"filepath","purchasebill.id as purchasebill_id").then(data => {
                return _.map(_.groupBy(data, item => item.purchase_id), (value, key) => {
                    return {
                        id: key,
                        client_id:value[0].client_id,
                        workorder_id:value[0].workorder_id,
                        quantity:value[0].quantity,
                        cost:value[0].cost,
                        tax:value[0].tax,
                        datecreated:value[0].datecreated,
                        itemName:value[0].itemName,
                        description:value[0].description,
                        attachments: _.map(value, attachItem => {
                            return {
                                id:attachItem.purchasebill_id,
                                filePath: attachItem.filepath,
                            }
                        })
                    }
                })
            }).catch((err) => {
                throw new Error(err.message);
            });
}
}
