import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import axios from "axios"
axios.defaults.baseURL = 'https://ucs85wrk.burrow.io/';

@Component({
  selector: "page-register",
  templateUrl: 'register.html'
})

export class RegisterPage {
  newUser: {email: string, password: string, confirmPassword: string};
  users: Array<{email: string, password: string, id: number}>;

  ionViewDidLeave() {
    this.newUser = { email: "", password: "", confirmPassword: "" }
  }

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController,
              public toastCtrl: ToastController, private fireAuth: AngularFireAuth
               ) {
    this.users = [];
    this.getUsers();
    this.newUser = { email: "", password: "", confirmPassword: "" };
  }

  registerNewUser() {
    let isUserRegistered = this.users.some(user => this.newUser.email == user.email);

    if(isUserRegistered) {
       this.presentToast(`Oops! I'm sorry but it seems the email: ${this.newUser.email} has already been taken, please try another one`);
    } else if(!this.newUser.email || !this.newUser.password || !this.newUser.confirmPassword) {
       this.presentToast("Please make sure all fields are properly filled");
    } else if(this.newUser.password.length < 6 || this.newUser.confirmPassword.length < 6) {
       this.presentToast("Please make sure the password has more than 6 characters");
    } else if(this.newUser.password != this.newUser.confirmPassword) {
       this.presentToast("We require both passwords fields to be equal, please make sure to enter the same password in both fields");
    } else {
          this.fireAuth.auth.createUserWithEmailAndPassword(this.newUser.email, this.newUser.password)
          .then(response => {
              axios.post('/users', {
                  email: response.email,
                  password: this.newUser.password
                }).then(axiosResponse => {
                     this.presentToast(`You've been successfully registered ${this.newUser.email}, now you'll be redirected to the home page`);
                     localStorage.setItem('userData', JSON.stringify(axiosResponse.data));
                     this.navCtrl.parent.select(1);
                 }).catch(error => {
                     this.presentToast(error);
                 });
          }).catch(fireAuthError => {
              this.presentToast(fireAuthError);
          });
      }
  }

  getUsers() {
    axios.get('/users')
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            this.presentToast(error);
        });
    }

  presentToast(message: any, duration: any = 5000) {
    let toast = this.toastCtrl.create({
      message:  message,
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }

}
