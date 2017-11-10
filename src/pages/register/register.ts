import axios from "axios";
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'register.html'
})

export class RegisterPage {
  newUser: Array<{username: string, password: string, confirmPassword: string}>;
  users: {username: string, password: string, id: number};

  constructor(public navCtrl: NavController) {
    this.newUser = [];
    this.users = {};
    this.getUsers();
  }

  registerNewUser() {
    let isUserRegistered = this.users.some(user => this.newUser.username == user.username);
    let noEmptyFields = this.users.some(user => this.newUser != "");
    if(isUserRegistered) {
       alert(`Oops! I'm sorry but it seems the username: ${this.newUser.username} has already been taken, please try another one`);
    } else if(noEmptyFields) {
       alert("Please make sure all fields are properly filled");
    } else if(this.newUser.password.length < 10 && this.newUser.confirmPassword.length < 10) {
       alert("Please make sure password has more than 10 characters");
    } else if(this.newUser.password != this.newUser.confirmPassword) {
       alert(`Per security validations we require both passwords fields to be equal,
             please make sure to enter the same password in both fields`);
    } else {
        axios.post('http://testing.burrow.io/users', {
                  username: this.newUser.username,
                  password: this.newUser.password
                 }).then(response => {
                 }).catch(error => {
                  console.log(error);
             });
        alert("You've been sucessfully registered, Welcome to our family!");
        this.newUser.username = "";
        this.newUser.password = "";
        this.newUser.confirmPassword = "";
        this.goBack();
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
