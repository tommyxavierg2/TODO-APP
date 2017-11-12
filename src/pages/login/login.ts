import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
  loginUser: {username: string, password: string, id: number};

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    this.loginUser = {
      username: "Test",
      password: "123456",
      id: 0
    };
  }

  goToRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  logIn() {
    if(this.loginUser.username == "" || this.loginUser.password == "") {
        alert("Please make sure all fields are properly filled");
    } else {
      this.presentLoadingDefault();
      this.gotoHomePage();
    }
  }

  gotoHomePage() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          this.loginUser = JSON.parse(this.responseText);
          sessionStorage.setItem('userData', JSON.stringify(this.loginUser));
          }
      }
    xhttp.open("GET", `https://testing1.burrow.io/users?username=${this.loginUser.username}&password=${this.loginUser.password}`);
    xhttp.send();
    this.loginUser.username = "";
    this.loginUser.password = "";
    this.navCtrl.push(HomePage);
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
        loading.dismiss();
    }, 2000);
  }
}
