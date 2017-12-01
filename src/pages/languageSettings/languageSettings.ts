import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'languageSettings.html'
})

export class LanguageSettingsPage {
  language: string;

  constructor(public navCtrl: NavController, public translateService: TranslateService) {
    this.language = 'en';
  }

  changeLanguage(selectedLanguage: string) {
    this.translateService.setDefaultLang(selectedLanguage);
  }

}
