import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  @ViewChild('tabs') tabRef: tabs;
  loginPage: any;
  registerPage: any;

  constructor(public navCtrl: NavController) {
    this.loginPage = LoginPage;
    this.registerPage = RegisterPage;
  }

}
