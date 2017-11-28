import { Component } from '@angular/core';
import { NavController, LoadingController, MenuController, ToastController } from 'ionic-angular';
import axios from "axios"
axios.defaults.baseURL = 'https://ucs85wrk.burrow.io/';

import { LoginRegisterTabsPage } from '../login-register-tabs/login-register-tabs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  offSet: number = 1;
  totalTasks: number = 0;
  message: string;
  newUserData: any;
  userData: any;
  tasks: Array<{description: string, isCompleted: boolean, userId: number, id: number}>;
  newTask: {description: string, isCompleted: boolean};

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public toastCtrl: ToastController) {
   this.tasks = [];
    this.newTask = { description: "", isCompleted: false };
    this.openMenu();
    Promise.all([this.loadUserData()]).then(value => {
      this.getTasks();
    }).catch(error => {
      this.presentToast(error);
    });

}

  doRefresh(refresher) {
      axios.get(`/tasks?userId=${this.userData.id}&_page=${this.offSet}&_limit=5`)
      .then(response => {
          let data = response.data;

          if(response.data) {
              data.forEach(val => {
                  this.tasks.push(val);
              });
              this.offSet++;
          }
      }).catch(error => {
          this.presentToast(`Tasks error: ${error}, please try again later`);
      }).then(() => refresher.complete());

  }

  loadUserData() {
    this.userData = JSON.parse(localStorage.getItem('userData'));

    if(!this.userData) {
       alert("I'm sorry, but in order to review, update or delete your tasks you first need to be logged in, you'll be redirected to the login page");
       localStorage.removeItem('userData');
       this.navCtrl.setRoot(LoginRegisterTabsPage);
     }
  }

  updateTasks(index) {
    let currentTask = this.tasks[index];

    if(!currentTask.description) {
        this.presentToast("The task you're trying to update is empty please check if your changes have been written");
    } else {
        axios.put(`/tasks/${currentTask.id}`, {
           description: currentTask.description,
           isCompleted: currentTask.isCompleted,
           userId: this.userData.id
        }).then(response => {
             this.presentToast("Task updated");
        }).catch(error => {
           this.presentToast(`Task was not updated ${error}, please try again later`);
        });
     }
  }

  getTasks() {

    axios.get(`/tasks?userId=${this.userData.id}&_page=${this.offSet}&_limit=5`)
            .then(response => {
               this.totalTasks = response.headers['x-total-count'];
               this.tasks = response.data;
               this.offSet++;
           }).catch(error => {
               this.presentToast(`Tasks error: ${error}, please try again later`);
           });
    }

  addTask() {
    let isDuplicated = this.tasks.some(task => this.newTask.description == task.description);

    if(!this.newTask.description) {
      this.presentToast("The task can't be empty");
    }
    else if(!isDuplicated) {
        axios.post('/tasks', {
                description: this.newTask.description,
                isCompleted: this.newTask.isCompleted,
                userId: this.userData.id
              }).then(response => {
                  this.tasks.push(response.data);
                  this.presentToast("Task added");
                  this.newTask.description = "";
              }).catch(error => {
                  this.presentToast(`Task was not updated ${error}, please try again later`);
              });

    } else {
          this.presentToast("Task already on the list, please add different one");
      }
 }

  deleteTask(index) {
    let taskIndex = this.tasks[index].id;
    this.tasks.splice(index, 1);
    axios.delete('/tasks/' + taskIndex ).then(response => {
            this.presentToast("Task deleted");
        }).catch(error => {
            this.presentToast(error);
        })
  }

  isCompleted = function() {

    return this.tasks.filter(task => task.isCompleted == true).length;
   }

  inProgress = function() {
    return this.tasks.filter(task => task.isCompleted == false).length;
  }

  openMenu() {
    this.menuCtrl.enable(true, 'menu-left');
  }

  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
