import axios from "axios";
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'register.html'
})

export class RegisterPage {
  newUser: {username: string, password: string, confirmPassword: string};
  users: Array<{username: string, password: string, id: number}>;

  constructor(public navCtrl: NavController) {
    this.users = [];
    this.getUsers();
    this.newUser = {
      username: "",
      password: "",
      confirmPassword: "",
    };
  }

  registerNewUser() {
    let isUserRegistered = this.users.some(user => this.newUser.username == user.username);
    if(isUserRegistered) {
       alert(`Oops! I'm sorry but it seems the username: ${this.newUser.username} has already been taken, please try another one`);
    } else if(this.newUser.username == "" || this.newUser.password == "" || this.newUser.confirmPassword == "") {
       alert("Please make sure all fields are properly filled");
    } else if(this.newUser.password.length < 6 && this.newUser.confirmPassword.length < 6) {
       alert("Please make sure the password has more than 6 characters");
    } else if(this.newUser.password != this.newUser.confirmPassword) {
       alert("Per security validations we require both passwords fields to be equal, please make sure to enter the same password in both fields");
    } else {
        axios.post('http://testing.burrow.io/users', {
                  username: this.newUser.username,
                  password: this.newUser.password
                 }).then(response => {
                     alert("You've been sucessfully registered, Welcome to our family!");
                     this.newUser.username = "";
                     this.newUser.password = "";
                     this.newUser.confirmPassword = "";
                     this.getUsers();
                     this.goBack();
                 }).catch(error => {
                    console.log(error);
             });
      }
  }

  getUsers() {
    axios.get('http://testing.burrow.io/users').then(response => {
            this.users = response.data;
          }).catch(erorr => {
            console.log(erorr);
        });
    }

    goBack() {
        this.navCtrl.pop();
    }

}
