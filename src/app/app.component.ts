import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { LoginPage } from '../pages/login/login';
import {TabsPage } from '../pages/tabs/tabs';
import { Facebook } from '@ionic-native/facebook';
import { HomePage } from '../pages/home/home';
import { ChartPage } from '../pages/chart/chart';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild('content') navCtrl: NavController;
  rootPage:any = ChartPage;
  message: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private googlePlus: GooglePlus, private facebook: Facebook) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  logout() {
    this.facebook.getLoginStatus(response => {
      if(response.status === "connected") {
           this.logoutFacebook();
       } else {
         this.logoutGoogle();
       }
     })
  }

  logoutGoogle() {
    this.googlePlus.logout().then(res=> {
      firebase.auth().signOut()
          .then(res => {
            this.message = "Hope to see you soon!";
            this.presentToast();
            sessionStorage.removeItem('userData');
            this.navCtrl.setRoot(LoginPage);
        }).catch( firebaseErr => {
            this.message = `${firebaseErr}`;
            this.presentToast();
            alert();
        });

    }).catch(googlePlusErr => {
        this.message = `${googlePlusErr}`;
    });
  }

   logoutFacebook() {
     this.facebook.logout()
     .then( response => {
       this.message = "Hope to see you soon";
       this.presentToast();
       sessionStorage.removeItem('userData');
       this.navCtrl.pop();
     })
      .catch(err => {
        alert(("err"));
      });
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
