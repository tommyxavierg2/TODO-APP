import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import axios from 'axios';
import { IonicStorageModule } from '@ionic/storage';

import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';

export const firebaseConfig = {
  apiKey: "AIzaSyA_1lUAhFwdp3MSvWSfZNqFuaFz2XXxL98",
  authDomain: "todo-app-1feb3.firebaseapp.com",
  databaseURL: "https://todo-app-1feb3.firebaseio.com",
  projectId: "todo-app-1feb3",
  storageBucket: "todo-app-1feb3.appspot.com",
  messagingSenderId: "772372597116"
}
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    RegisterPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    RegisterPage,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    {
      provide: ErrorHandler,
      useValue: axios,
      useClass: IonicErrorHandler
    },
    Facebook
  ]
})
export class AppModule {}
