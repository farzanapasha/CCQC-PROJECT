import PDF from 'html-pdf'
import ejs from 'ejs';
// import pdfTemplate from './invoiceTemplate.ejs'
export default class Util {
    static generatePDF(invoice) {
        return new Promise((resolve, reject) => {
            ejs.renderFile(__dirname + "/invoiceTemplate.ejs", { data: invoice }, function (err, data) {
                if (err) {
                    console.log(err);
                    reject("failed")
                } else {
            PDF.create(data, { timeout: '150000', format: 'A2' }).toBuffer((err, buffer) => {
                if (err) {
                    console.log(err)
                   reject("failed")
                }
                resolve(buffer)
            })
        }
    })
        })
    }
}