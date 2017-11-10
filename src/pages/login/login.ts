import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import axios from "axios";


@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
  loginUser: Array<{username: string, password: string}>;
  users: {username: string, password: string, id: number};

  constructor(public navCtrl: NavController) {
    this.loginUser = [];
    this.users = {username:"", password: "", id: 0};
    this.getUsers();
  }

  getUsers() {
    axios.get('http://testing.burrow.io/users').then(response => {
            this.users = response.data;
          }).catch(erorr => {
            console.log(erorr);
        });
    }

    goToRegisterPage() {
      this.navCtrl.push(RegisterPage);
    }

    logIn() {
      let isUserRegistered = this.users.some(user => this.loginUser.username == user.username);
      let passwordMatches = this.users.some(user => this.loginUser.password == user.password);
      if(this.loginUser.username == "" || this.loginUser.password == "") {
          alert("Please make sure all fields are properly filled");
      } else if(!isUserRegistered) {
          alert(`Opps! I'm sorry but it seems username ${this.loginUser.username} is not registered, please try again`);
      } else if(!passwordMatches) {
          alert(`I'm sorry but it seems that the password under the username: ${this.loginUser.username} is not corretct, please verify the password and try again`);
      } else {
          this.gotoHomePage();
      }
    }

    gotoHomePage() {
      this.navCtrl.push(HomePage);
    }
}
