import * as  admin from "firebase-admin"

var serviceAccount = require("./google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://acservicemanagementapp.firebaseio.com"
});

export default class MailerService {
    static sendNotification(data,tokens) { 
      // {
      //   type:type,
      //   title: title,
      //   body: body
      // }
      // tokens=["eOJYhxPvQTmwPdoYsJT-6e:APA91bFKfO7uUGE3PE-1RR6SOne50P-nXRIbcbODBuNC04nv0hl2NlJmFyZ5VZ_ecJoMmBu6l5ZVL8TCjpam2NzFTUGlqGzwGjQoiMbT0Lx7bI97Q6vXr1LGmaioPPGSfwRQR9nXQ-Lq"]             
          var message = {
            data: data,
            tokens: tokens,
          };
         return  admin.messaging().sendMulticast(message)
            .then((response) => {
              // Response is a message ID string.
              console.log('Successfully sent message:', response);
              return true
            })
            .catch((error) => {
              console.log('Error sending message:', error);
              throw err
            });
    }
}

