import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { CarouselPage } from '../carousel/carousel';
import { PushNotificationPage } from '../push-notification/push-notification';

@Component({
  templateUrl: 'login-register-tabs.html'
})

export class LoginRegisterTabsPage {
  loginPage: any;
  registerPage: any;
  carouselPage: any;
  pushNotificationPage: any;

  constructor(public navCtrl: NavController) {
    this.loginPage = LoginPage;
    this.registerPage = RegisterPage;
    this.carouselPage = CarouselPage;
    this.pushNotificationPage = PushNotificationPage;
  }

}
