import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';

import { LoginRegisterTabsPage } from '../pages/login-register-tabs/login-register-tabs';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild('content') navCtrl: NavController;

  rootPage:any = LoginRegisterTabsPage;
  userData: any;

  constructor(private platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen, private googlePlus: GooglePlus,
    private facebook: Facebook, private toastCtrl: ToastController,
    private onesignal: OneSignal) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.initializeOneSignalApp();

    });
  }

  initializeOneSignalApp() {
    this.onesignal.startInit("8283ce20-b273-4647-b994-44eee08979f3", "772372597116");
    this.onesignal.inFocusDisplaying(this.onesignal.OSInFocusDisplayOption.InAppAlert)
    this.onesignal.setSubscription(true);
    this.onesignal.handleNotificationReceived().subscribe(() => {
        // your code after Notification received.
    });
    this.onesignal.handleNotificationOpened().subscribe(jsonData => {
        // your code to handle after Notification opened
        //alert(JSON.stringify(jsonData));

    });
    this.onesignal.endInit();
  }

  logout() {
    Promise.all([this.logoutGoogleAndEmail()]).then(response => {})
    .catch(err => {
      this.logoutFacebook();
    });
  }

  logoutGoogleAndEmail() {
    this.presentToast();
    localStorage.removeItem('userData');
    this.navCtrl.setRoot(LoginRegisterTabsPage);
    this.googlePlus.logout().then(res=> {
      firebase.auth().signOut().then(res => {
    });
  });
}

   logoutFacebook() {
     this.presentToast();
     this.facebook.logout();
     localStorage.removeItem('userData');
     this.navCtrl.setRoot(LoginRegisterTabsPage);
   }

   presentToast(message: any = "Hope to see you soon!") {
     let toast = this.toastCtrl.create({
       message: message,
       duration: 2000,
       position: 'bottom'
     });
     toast.present();
   }

}
