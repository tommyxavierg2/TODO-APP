import { Component, ViewChild } from '@angular/core';
import { ToastController } from 'ionic-angular';

import { Chart } from 'chart.js';
import axios from "axios"
axios.defaults.baseURL = 'https://t6ovbruo.burrow.io/';

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
  users: any;
  tasks: any;

  constructor(public toastCtrl: ToastController) {
    Promise.all([this.getUsers(), this.getTasks()]).then(() => {
      this.showCharts();
    }).catch(error => {
      this.message = error;
      this.presentToast();
    });
  }

  showCharts() {

    var totalUsers = this.users.length;
    var totalTasks = this.tasks.length;
    var totalCompletedTasks = this.tasks.filter(task => task.isCompleted == false);
    var totalIncompletedTasks = this.tasks.filter(task => task.isCompleted != false);

    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'horizontalBar',
      data: {
          labels: ["Users", "Tasks", "Completed tasks", "Incompleted tasks"],
          datasets: [{
            label: 'Users and tasks totals',
              data: [totalUsers, totalTasks, totalIncompletedTasks.length, totalCompletedTasks.length],
              backgroundColor: [
                   'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
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

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

        type: 'doughnut',
        data: {
          labels: ["Users", "Tasks", "Completed tasks", "Incompleted tasks"],
          datasets: [{
            data: [totalUsers, totalTasks, totalIncompletedTasks.length, totalCompletedTasks.length],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6384"
            ]
          }]
        }
      });

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
