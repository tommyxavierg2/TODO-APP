import axios from "axios";
import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
axios.defaults.baseURL = 'https://t6ovbruo.burrow.io/';

@Component({
  selector: "page-register",
  templateUrl: 'register.html'
})

export class RegisterPage {
  message: string;
  newUser: {email: string, password: string, confirmPassword: string};
  users: Array<{email: string, password: string, id: number}>;

  ionViewDidLeave() {
    this.newUser = { email: "", password: "", confirmPassword: "" }
  }

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public toastCtrl: ToastController, private fireAuth: AngularFireAuth) {
    this.users = [];
    this.getUsers();
    this.newUser = { email: "", password: "", confirmPassword: "" };
  }

  registerNewUser() {
    let isUserRegistered = this.users.some(user => this.newUser.email == user.email);

    if(isUserRegistered) {
       this.message = `Oops! I'm sorry but it seems the email: ${this.newUser.email} has already been taken, please try another one`;
       this.presentToast();
    } else if(!this.newUser.email || !this.newUser.password || !this.newUser.confirmPassword) {
       this.message = "Please make sure all fields are properly filled";
       this.presentToast();
    } else if(this.newUser.password.length < 6 || this.newUser.confirmPassword.length < 6) {
       this.message = "Please make sure the password has more than 6 characters";
       this.presentToast();
    } else if(this.newUser.password != this.newUser.confirmPassword) {
       this.message = "We require both passwords fields to be equal, please make sure to enter the same password in both fields";
       this.presentToast();
    } else {
          this.fireAuth.auth.createUserWithEmailAndPassword(this.newUser.email, this.newUser.password)
          .then(response => {
              axios.post('/users', {
                  email: response.email,
                  password: this.newUser.password
                }).then(axiosResponse => {
                     this.message = `You've been successfully registered ${this.newUser.email}, now you'll be redirected to the home page`;
                     this.presentToast();
                     sessionStorage.setItem('newUserData', JSON.stringify(axiosResponse.data));
                     this.newUser = { email: "", password: "", confirmPassword: "" }
                     this.presentLoadingDefault();
                     this.navCtrl.parent.select(1);
                 }).catch(error => {
                     this.message = error;
                     this.presentToast();
                 });
          }).catch(fireAuthError => {
              this.message = fireAuthError;
              this.presentToast();
          });
      }
  }

  getUsers() {
    axios.get('/users')
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            this.message = error;
            this.presentToast();
        });
    }

    presentLoadingDefault() {
      let loading = this.loadingCtrl.create({
        content: "Redirecting to the login page..."
      });

      loading.present();

      setTimeout(() => {
          loading.dismiss();
      }, 3000);
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
