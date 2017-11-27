import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

import { LoginRegisterTabsPage } from '../pages/login-register-tabs/login-register-tabs';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild('content') navCtrl: NavController;

  rootPage:any = LoginRegisterTabsPage;
  userData: any;
  message: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private googlePlus: GooglePlus, private facebook: Facebook, private toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  logout() {
    Promise.all([this.logoutGoogleAndEmail()]).then(response => {})
    .catch(err => {
      this.logoutFacebook();
    });
  }

  logoutGoogleAndEmail() {
    localStorage.removeItem('userData');
    this.message = "Hope to see you soon!";
    this.presentToast();
    this.navCtrl.setRoot(LoginRegisterTabsPage);
    this.googlePlus.logout().then(res=> {
      firebase.auth().signOut().then(res => {
    });
  });
}

   logoutFacebook() {
     this.facebook.logout();
     localStorage.removeItem('userData');
     this.message = "Hope to see you soon!";
     this.presentToast();
     this.navCtrl.setRoot(LoginRegisterTabsPage);
   }

   presentToast() {
     let toast = this.toastCtrl.create({
       message: this.message,
       duration: 2000,
       position: 'bottom'
     });
     toast.present();
   }

}
