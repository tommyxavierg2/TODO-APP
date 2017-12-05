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
import { AngularFireAuthModule } from 'angularfire2/auth';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { Push } from '@ionic-native/push';
import { OneSignal } from '@ionic-native/onesignal';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { LoginRegisterTabsPage } from '../pages/login-register-tabs/login-register-tabs';
import { ChartPage } from '../pages/chart/chart';
import { CarouselPage } from '../pages/carousel/carousel';
import { HomeChartTabsPage } from '../pages/home-chart-tabs/home-chart-tabs';
import { PushNotificationPage } from '../pages/push-notification/push-notification';
import { LanguageSettingsPage } from '../pages/languageSettings/languageSettings';

export const firebaseConfig = {
  apiKey: "AIzaSyA_1lUAhFwdp3MSvWSfZNqFuaFz2XXxL98",
  authDomain: "todo-app-1feb3.firebaseapp.com",
  databaseURL: "https://todo-app-1feb3.firebaseio.com",
  projectId: "todo-app-1feb3",
  storageBucket: "todo-app-1feb3.appspot.com",
  messagingSenderId: "772372597116"
}
firebase.initializeApp(firebaseConfig);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "../assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    RegisterPage,
    ChartPage,
    CarouselPage,
    LoginRegisterTabsPage,
    HomeChartTabsPage,
    PushNotificationPage,
    LanguageSettingsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    RegisterPage,
    ChartPage,
    CarouselPage,
    LoginRegisterTabsPage,
    HomeChartTabsPage,
    PushNotificationPage,
    LanguageSettingsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    Facebook,
    Push,
    OneSignal,
    {
      provide: ErrorHandler,
      useValue: axios,
      useClass: IonicErrorHandler
    },
  ]
})
export class AppModule {}
