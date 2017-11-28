import { Component, ViewChild } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { Chart } from 'chart.js';
import axios from "axios"
axios.defaults.baseURL = 'https://ucs85wrk.burrow.io/';

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  barChart: any;
  doughnutChart: any;
  message: any;
  userData: any;
  userTasks: any;
  users: any;
  tasks: any;

  constructor(public toastCtrl: ToastController) {
    Promise.all([this.getUsers(), this.getTasks(), this.loadUserData()]).then(() => {
      this.showCharts();
    }).catch(error => {
      this.message = error;
      this.presentToast();
    });
  }

  showCharts() {

    let totalUsers = this.users.length;
    let totalTasks = this.tasks.length;
    let totalCompletedTasks = this.tasks.filter(task => task.isCompleted == false);
    let totalIncompletedTasks = this.tasks.filter(task => task.isCompleted != false);

    this.userTasks = this.tasks.filter(task => task.userId == this.userData.id);

    let myTotalTasks = this.userTasks.length;
    let myTotalCompletedTasks = this.userTasks.filter(task => task.isCompleted == true);
    let myTotalIncompletedTasks = this.userTasks.filter(task => task.isCompleted == false);

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

        type: 'doughnut',
        data: {
          labels: ["Tasks", "Incompleted tasks", "Completed tasks"],
          datasets: [{
            data: [myTotalTasks, myTotalIncompletedTasks.length, myTotalCompletedTasks.length],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
            ]
          }]
        }
      });

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'horizontalBar',
      data: {
          labels: ["Users", "Tasks", "Completed tasks", "Incompleted tasks"],
          datasets: [{
            label: 'Users and tasks totals',
              data: [totalUsers, totalTasks, totalIncompletedTasks.length, totalCompletedTasks.length],
              backgroundColor: [
                   'rgba(0, 255, 0, 0.3)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 0.3)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

  }

  loadUserData() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

    getUsers() {
      return axios.get('/users')
      .then(response => {
        this.users = response.data;
      })
      .catch(error => {
        this.message = error;
        this.presentToast();
      });
    }

    getTasks() {
      return axios.get('/tasks').then(response => {
        this.tasks = response.data;
      }).catch(error => {
        this.message = error;
        this.presentToast();
      });
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
