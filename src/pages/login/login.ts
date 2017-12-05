import { Component } from '@angular/core';
import { NavController, LoadingController, MenuController, ToastController } from 'ionic-angular';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import axios from "axios"
axios.defaults.baseURL = 'http://173.45.134.35:8080/';

import { HomeChartTabsPage } from '../home-chart-tabs/home-chart-tabs';

@Component({
  selector: "page-login",
  templateUrl: 'login.html'
})

export class LoginPage {
  userData: any;
  users: any;
  loading: any;
  isLoggedIn: boolean;
  googleUserData: any;
  facebookUserData: any;
  googleUserProfile: any = null;
  loginUser: {email: string, password: string, id: number};

  ionViewWillEnter() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    localStorage.removeItem('userData');

    if(this.userData != null) {
        this.goToHomePage(this.userData);
      }

   else {
      this.menu.enable(false);
      this.getUsers();
    }
  }

  ionViewDidLeave() {
      this.loginUser = { email: "", password: "", id: null };
      this.menu.enable(true);
  }

  constructor(
    public navCtrl: NavController, public loadingCtrl: LoadingController,
    public menu: MenuController, private googlePlus: GooglePlus, private facebook: Facebook,
    public toastCtrl: ToastController, public translateService: TranslateService) {
    this.loginUser = { email: "", password: "", id: 0 };
    this.isLoggedIn= false;
    this.users = [{email: "", password: "", id: null }];
  }

  goToRegisterPage() {
    this.navCtrl.parent.select(1);
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
              this.showLoading();
              let isUserRegistered = this.users.some(user => this.googleUserData.email == user.email);

              if(!isUserRegistered) {
                  axios.post("users", {
                              email: this.googleUserData.email,
                              googleUserId: this.googleUserData.uid
                          }).then(resp => {
                              this.isLoggedIn = true;
                              this.goToHomePage(resp.data);
                              this.googleUserData = { email: "", uid: "" };
                              this.loading.dismiss();
                        }).catch(err => {
                              this.presentToast(`Axios Error ${err}`);
                        });
               } else {
                 axios.get(`users?email=${this.googleUserData.email}`)
                 .then(res => {
                   this.isLoggedIn = true;
                   this.goToHomePage(res.data[0]);
                   this.loading.dismiss();
                 })
               }
           })
        .catch(firebaseError => {
          this.presentToast(`firebaseError: ${firebaseError}`);
        });
      })
   .catch(googlePlusError => {
     this.presentToast(`GooglePlus Error: ${googlePlusError}`);
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

            axios.post(`users`, {
              email: this.facebookUserData.email,
              username: this.facebookUserData.username
            })
            .then(res => {
              this.showLoading();
              this.isLoggedIn = true;
              this.goToHomePage(res.data[0]);
              this.loading.dismiss();
            })
            .catch(axiosError => {
              this.presentToast(`Axios Error: ${axiosError}`);
            });

        } else {
            this.showLoading();

            axios.get(`users?email=${this.facebookUserData.email}`)
            .then(res => {
                this.isLoggedIn = true;
                this.goToHomePage(res.data[0]);
                this.loading.dismiss();
            })
            .catch(axiosErr => {
              this.presentToast(`Axios error: ${axiosErr}`);
            });
          }
       })
       .catch(facebookError => {
         this.presentToast(`Facebook Error ${facebookError}`);
         });
     });
  }

  loginWithEmail() {
    let isUserRegistered = this.users.some(user => this.loginUser.email == user.email);
    let isPasswordCorrect = this.users.some(user => this.loginUser.password == user.password);

    if(!this.loginUser.email || !this.loginUser.password) {
        this.presentToast("Please make sure all fields are properly filled");
    } else if (!isUserRegistered) {
        this.presentToast(`The User: ${this.loginUser.email} is not registered, please verify it and try again.`);
    } else if (!isPasswordCorrect) {
          this.presentToast(`The password for user: ${this.loginUser.email} is not correct, please verify and try again.`);
    } else {
       this.showLoading();
       axios.get(`users?email=${this.loginUser.email}&password=${this.loginUser.password}`)
        .then(response => {
           this.loginUser = { email: "", password: "", id: null };
           this.isLoggedIn = true;
           this.goToHomePage(response.data[0]);
        }).catch(error => {
           this.presentToast(`Error: ${error}`);
        }).then(() => {
           this.loading.dismiss();
        });
     }

   }

  showLoading(message: any = "Loading...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
  }

  goToHomePage(data: any) {
    localStorage.setItem('userData', JSON.stringify(data));
    this.navCtrl.push(HomeChartTabsPage);
  }

  getUsers() {
    axios.get('users')
    .then( res => {
      this.users = res.data;
    })
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }


}
