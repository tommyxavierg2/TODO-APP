import { Component } from '@angular/core';
import { NavController, LoadingController, MenuController, ToastController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import firebase from 'firebase';
import axios from "axios"
axios.defaults.baseURL = 'https://of7anpsi.burrow.io/';

@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
  message: string;
  newUserData: any;
  users: any;
  isLoggedIn: boolean;
  googleUserData: any;
  facebookUserData: any;
  googleUserProfile: any = null;
  loginUser: {email: string, password: string, id: number};

  ionViewWillEnter() {
    this.newUserData = JSON.parse(sessionStorage.getItem('newUserData'));
    if (this.newUserData) {
      axios.get(`/users?email=${this.newUserData.email}`)
        .then(res => {
            this.newUserData = res.data;
            this.goToHomePage(this.newUserData);
            this.newUserData = {email: "", pasword: "", id: null};
        })
    } else {
      this.menu.enable(false);
      this.getUsers();
    }
  }

  ionViewDidLeave() {
      this.loginUser = { email: "", password: "", id: null };
      this.menu.enable(true);
      sessionStorage.removeItem('newUserData');
  }

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menu: MenuController, private googlePlus: GooglePlus, private facebook: Facebook, public toastCtrl: ToastController) {
    this.loginUser = { email: "", password: "", id: 0 };
    this.isLoggedIn= false;
  }

  goToRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  loginWithGoogle() {
    this.googlePlus.login({
      'webClientId': '772372597116-u54kak3ptk02f5lgm5mp5u2h05chn2op.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then( response => {
              this.isLoggedIn = true;
              this.googleUserData = {
                email: response.email,
                username: response.displayName
              };
              let isUserRegistered = this.users.some(user => this.googleUserData.email == user.email);

              if(!isUserRegistered) {
                  axios.post("/users", {
                              email: this.googleUserData.email,
                              googleUserId: this.googleUserData.uid
                          })
                        .then(resp => {
                          this.googleUserData.id = resp.data.id;
                          this.isLoggedIn = true;
                          this.goToHomePage(this.googleUserData);
                          this.googleUserData = { email: "", uid: "" };
                        })
                       .catch(err => {
                         alert(`Axios Erro ${err}`)
                       });
               } else {
                 axios.get(`/users?=${this.googleUserData.email}`)
                 .then(res => {
                   this.goToHomePage(res.data);
                 })
               }
           })
        .catch(firebaseError => {
          alert(`firebaseError: ${firebaseError}`);
        });
      })
   .catch(googlePlusError => {
    alert(`GooglePlus Error: ${googlePlusError}`)
  });
}

loginWithFacebook() {

  this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
    this.facebook.api('me?fields=id,name,email,first_name,picture.widht(150).height(150).as(picture_large)', [])
      .then(profile => {
        this.facebookUserData = {
          "email": profile['email'],
          "username": profile['name']
        };

        let isUserRegistered = this.users.some(user => this.facebookUserData.email == user.email);

        if(!isUserRegistered) {

            axios.post(`/users`, {
              email: this.facebookUserData.email,
              username: this.facebookUserData.username
            })
                .then(res => {
                  this.isLoggedIn = true;
                  this.facebookUserData.id = res.data.id;
                  this.goToHomePage(this.facebookUserData);
                })
                .catch(axiosError => {
                  alert(`Axios Error: ${axiosError}`);
                });

        } else {

            axios.get(`/users?email=${this.facebookUserData.email}`)
            .then(res => {
                this.isLoggedIn = true;
                this.goToHomePage(res.data);
            })
            .catch(axiosErr => {
                alert(`Axios error: ${axiosErr}`);
            });
          }
       })
       .catch(facebookError => {
          alert(`Facebook Error ${facebookError}`);
         });
     });
}

  loginWithEmail() {
    let isUserRegistered = this.users.some(user => this.loginUser.email == user.email);
    let isPasswordCorrect = this.users.some(user => this.loginUser.password == user.password);

    if(this.loginUser.email == "" || this.loginUser.password == "") {
        this.message = "Please make sure all fields are properly filled";
        this.presentToast();

    } else if (!isUserRegistered) {
          this.message = `The User: ${this.loginUser.email} is not registered, please verify it and try again.`;
          this.presentToast();

    } else if (!isPasswordCorrect) {
          this.message = `The password for user: ${this.loginUser.email} is not correct, please verify and try again.`;
          this.presentToast();

    } else {
       this.presentLoadingDefault();
       axios.get(`/users?email=${this.loginUser.email}&password=${this.loginUser.password}`)
        .then(response => {
           this.isLoggedIn = true;
           this.loginUser = { email: "", password: "", id: null };
           this.goToHomePage(response.data);
        })
        .catch(error => {
            alert(`Error: ${error}`);
        });
     }

   }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
        loading.dismiss();
    }, 2500);
  }

  goToHomePage(data: any) {
    sessionStorage.setItem('userData', JSON.stringify(data));
    this.navCtrl.push(HomePage);
  }

  getUsers() {
    axios.get('/users')
    .then( res => {
      this.users = res.data;
    })
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }


}
