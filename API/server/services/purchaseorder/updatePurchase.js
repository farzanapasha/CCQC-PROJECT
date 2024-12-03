import _ from 'lodash';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import Time from './../../helpers/time';
import DB from './../../helpers/db';
import purchaseorder from '.';

export default class TeamController {

    static update(id, input) {
        if (input.item_id || input.client_id || input.workorder_id || input.quantity || 
            input.description || input.cost || input.tax || input.datecreated) {
            let purchaseOrderInput = _.pick(input, [`item_id`,`client_id`,`workorder_id`,`quantity`,
            `description`,`cost`,`tax`,`datecreated`, "modifiedby"])
            return DB("purchaseorder").where('id', '=', id)
                .update(purchaseOrderInput).then(data => {
                    if (input.attachment) {
                        let purchaseBillBatch = _.map(input.attachment, item => {
                            return { purchase_id: id,filepath:item.filepath, createdby:input.modifiedby, modifiedby: input.modifiedby }
                        })
                        var chunkSize = 30;
                        return DB("purchasebill").where('purchase_id', '=', id)
                            .del().then(deletedmapping => {

                                return DB.batchInsert('purchasebill', purchaseBillBatch, chunkSize)
                                    .returning('id')
                                    .then(ids => {
                                        return { message: "purchase order updated sucessfully" }
                                    })

                            })
                    }
                    else {
                        return { message: "purchase order updated sucessfully" }
                    }
                }).catch((err) => {
                    console.log(err)
                    throw err;
                });
        }
        else if (input.attachment) {

            var chunkSize = 30;
            return DB("purchaseorder").where('id', '=', id).then(purchaseorderdata => {
                let purchaseBillBatch = _.map(input.attachment, item => {
                    return { purchase_id: id, filepath: item.filepath, modifiedby: input.modifiedby, createdby: purchaseorderdata[0].createdby }
                })
                console.log(purchaseBillBatch,input)
                return DB("purchasebill").where('purchase_id', '=', id)
                    .del().then(deletedmapping => {
                        return DB.batchInsert('purchasebill', purchaseBillBatch, chunkSize)
                            .returning('id')
                            .then(ids => {
                                return { message: "purchase order updated sucessfully" }
                            })

                    })
            })
        }
        else {
            return Promise.resolve().then(() => {
                return { message: "Provide data for Purchase update" }
            })
        }

    }

}