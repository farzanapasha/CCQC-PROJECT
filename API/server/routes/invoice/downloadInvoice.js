import _pick from 'lodash/pick';

import Exception from './../../helpers/exception';
import Validator from './../../helpers/validator';
import InvoiceService from './../../services/invoice'

export default class InvoiceController {
static download(req, res) {
    const {
        id
    } = req.query;
    const rules = {
        id: 'required'
    };
    Validator.run({
        id
    }, rules).then(() => {
        return InvoiceService.downloadInvoice.download(id);
    }).then((result) => {

  res.writeHead(200, {
    'Content-Disposition': 'attachment; filename="invoice #INV'+id+'.pdf"',
    'Content-Type': "application/pdf",
  })

//   const download = Buffer.from(fileData, 'base64')
  res.end(result)
    }).catch((err) => {
        console.log(err)
        Exception.failWith(req, res, err);
    });
}

static downloadBuffer(req, res) {
  const {
      id
  } = req.query;
  const rules = {
      id: 'required'
  };
  Validator.run({
      id
  }, rules).then(() => {
      return InvoiceService.downloadInvoice.download(id);
  }).then((result) => {

    res.status(200).json({
              data: result
          })
  }).catch((err) => {
      console.log(err)
      Exception.failWith(req, res, err);
  });
}
}
