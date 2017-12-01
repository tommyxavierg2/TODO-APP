import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal'
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'push-notification.html'
})

export class PushNotificationPage {
  oneSignalUserId: string;
  userMessage:string;

  ionViewDidLeave() {
    this.userMessage = "";
  }

  constructor(public navCtrl: NavController, private onesignal: OneSignal) {
    this.userMessage = "";
  }

  sendNotification(message:string) {
    this.onesignal.getIds().then((ids) => {
      this.createNotification(ids.userId, message);
    }).catch((err) => console.log(err));
  }

  createNotification(userId:string, message:string) {
      let notif_count: number = 1;
      var messageData:any = {
        app_id: "8283ce20-b273-4647-b994-44eee08979f3",
        include_player_ids: [userId],
        contents: { en: message },
        android_channel_id: "84b986ce-8226-4604-ac07-3c8273ea8cf6",
        android_group: [notif_count]
      };
      this.onesignal.postNotification(messageData)
      .then(res => {
        //Returns device ID and recipient ID
        this.userMessage = "";
      }).catch(err => {
        console.log(JSON.stringify(err));
      })
   }

}
