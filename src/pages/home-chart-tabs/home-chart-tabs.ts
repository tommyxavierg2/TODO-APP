import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ChartPage } from '../chart/chart';

@Component({
  templateUrl: 'home-chart-tabs.html'
})

export class HomeChartTabsPage {
  homePage: any;
  chartPage: any;

  constructor() {
    this.homePage = HomePage;
    this.chartPage = ChartPage;
  }
}
