import _ from 'lodash';

import DB from './../../helpers/db';

export default class TeamController {
    static create(purchase) {
        let purchaseorder = _.pick(purchase, [`item_id`,`client_id`,`workorder_id`,`quantity`,
        `description`,`cost`,`tax`,`datecreated`, "createdby"])
        return DB("purchaseorder").returning('id').insert(purchaseorder).then(data => {
            if (purchase.attachment.length > 0) {
                let purchaseBillBatch = _.map(purchase.attachment, item => {
                    return { purchase_id: data[0], filepath:item.filepath, createdby: purchase.createdby }
                })
                var chunkSize = 30;
                return DB.batchInsert('purchasebill', purchaseBillBatch, chunkSize)
                    .returning('id')
                    .then(id => {
                        return { message: "purchaseorder created sucessfully" }
                    })
            }
            else {
                return { message: "purchaseorder created sucessfully" }
            }
        }).catch((err) => {
            console.log(err)
            throw err;
        });
    }
}