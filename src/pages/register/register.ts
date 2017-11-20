import axios from "axios";
import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
axios.defaults.baseURL = 'https://of7anpsi.burrow.io/';

@Component({
  templateUrl: 'register.html'
})

export class RegisterPage {
  newUser: {email: string, password: string, confirmPassword: string};
  users: Array<{email: string, password: string, id: number}>;

  ionViewWillEnter() {
    this.getUsers();
  }

  ionViewDidLeave() {
    this.newUser = { email: "", password: "", confirmPassword: "" }
  }

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public tostCtrl: ToastController) {
    this.users = [];
    this.getUsers();
    this.newUser = { email: "", password: "", confirmPassword: "" };
  }

  registerNewUser() {
    let isUserRegistered = this.users.some(user => this.newUser.email == user.email);
    if(isUserRegistered) {
       alert(`Oops! I'm sorry but it seems the email: ${this.newUser.email} has already been taken, please try another one`);
    } else if(this.newUser.email == "" || this.newUser.password == "" || this.newUser.confirmPassword == "") {
       alert("Please make sure all fields are properly filled");
    } else if(this.newUser.password.length < 6 && this.newUser.confirmPassword.length < 6) {
       alert("Please make sure the password has more than 6 characters");
    } else if(this.newUser.password != this.newUser.confirmPassword) {
       alert("Per security validations we require both passwords fields to be equal, please make sure to enter the same password in both fields");
    } else {
        axios.post('/users', {
                  email: this.newUser.email,
                  password: this.newUser.password
                 }).then(response => {
                     this.presentLoadingDefault();
                     sessionStorage.setItem('newUserData', JSON.stringify(this.newUser));
                     this.newUser = { email: "", password: "", confirmPassword: "" }
                     this.navCtrl.parent.select(0);
                 }).catch(error => {
                    console.log(error);
             });
      }
  }

  getUsers() {
    axios.get('/users').then(response => {
            this.users = response.data;
          }).catch(erorr => {
            console.log(erorr);
        });
    }

    presentLoadingDefault() {
      let loading = this.loadingCtrl.create({
        content: `You've been sucessfully registered ${this.newUser.email}, Welcome to our family!`
      });

      loading.present();

      setTimeout(() => {
          loading.dismiss();
      }, 3000);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Task sucessfully added',
      duration: 1500,
      pos: 'middle'
    });
    toast.present();
  }

}
