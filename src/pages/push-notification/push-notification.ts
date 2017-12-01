import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal'
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'push-notification.html'
})

export class PushNotificationPage {
  oneSignalUserId: string;
  message:string;

  constructor(public navCtrl: NavController, private onesignal: OneSignal) {
    this.message = "";
  }

  sendNotification(message:string) {
    this.onesignal.getIds().then((ids) => {
      console.log(ids);
      this.createNotification(ids.userId, message);
    }).catch((err) => console.log(err));
  }

  createNotification(userId:string, message:string) {
      var message = {
        app_id: "8283ce20-b273-4647-b994-44eee08979f3",
        include_player_ids: [userId],
        contents: { en: message }
      };
      this.onesignal.postNotification(message)
      .then(res => {
        console.log(JSON.stringify(res));
      }).catch(err => {
        console.log(JSON.stringify(err));
      })
   }

}
