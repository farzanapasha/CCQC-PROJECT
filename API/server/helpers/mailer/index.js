import nodemailer from 'nodemailer';

import Defines from './../../config';




   /*
mail object format

let obj = {
    to:["example@mail.com","example2@mail.com"],
    cc:["example@mail.com","example2@mail.com"],
    bcc:["example@mail.com","example2@mail.com"],
    subject:"subject of mail"
    html:"should be text , html or json"
    attachments:[{
        filename:"name of attached file",
        content:"base64 format of file",
        encoding: 'base64'
    }]
}*/

let smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,

    auth: {
        user: Defines.EMAIL_ADDRESS,
        pass: Defines.EMAIL_PASSWD,
    },
    tls: {
        ciphers: 'SSLv3'
    },
    requireTLS: true
});

export default class MailerService {
    static sendmail(mailDetails) {
        let mailOptions = Object.assign({from: Defines.EMAIL_ADDRESS,replyTo: Defines.EMAIL_ADDRESS}, mailDetails);
        return smtpTransport.sendMail(mailOptions).then(data=>{
            return {success:true}
        }).catch(err=>{
            console.log(err)
            return {success:false,err:err}
        });
    }
}