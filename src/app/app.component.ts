import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { LoginPage } from '../pages/login/login';
import { Facebook } from '@ionic-native/facebook';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild('content') navCtrl: NavController;
  rootPage:any = LoginPage;
  isFacebook: boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private googlePlus: GooglePlus, private facebook: Facebook) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

   logoutGoogle() {
    this.googlePlus.logout().then(res=> {
      firebase.auth().signOut()
          .then(res => {
            alert("Hope to see you soon!");
            sessionStorage.removeItem('userData');
            this.navCtrl.setRoot(LoginPage);
        }).catch( firebaseErr => {
            alert(firebaseErr);
        });

    }).catch(googlePlusErr => {
       alert(googlePlusErr);
    });
  }

   logoutFacebook() {
    this.isFacebook = true;
    if(!this.isFacebook){
        this.facebook.logout()
        .then( res => {
          alert("Hope to see you soon!");
        })
        .catch(e => alert("Error logout from facebook"));
      }
    }

}
