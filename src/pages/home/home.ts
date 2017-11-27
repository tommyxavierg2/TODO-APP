import { Component } from '@angular/core';
import { NavController, LoadingController, MenuController, ToastController } from 'ionic-angular';
import axios from "axios"
axios.defaults.baseURL = 'https://t6ovbruo.burrow.io/';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  offSet: number = 1;
  totalTasks: number = 0;
  message: string;
  userData: any;
  updateTaskData: string;
  tasks: Array<{description: string, isCompleted: boolean, userId: number, id: number}>;
  newTask: {description: string, isCompleted: boolean};

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public toastCtrl: ToastController) {
   this.tasks = [];
    this.newTask = { description: "", isCompleted: false };
    this.openMenu();
    Promise.all([this.loadUserData()]).then(value => {
      this.getTasks();
    }).catch(error => {
      this.message = error;
      this.presentToast();
    });

}

  doInfinite(infiniteScroll) {

    if (this.tasks.length != this.totalTasks) {
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
              this.message =`Tasks error: ${error}, please try again later`;
              this.presentToast();
          }).then(() => infiniteScroll.complete());
     } else {
         infiniteScroll.enable(false);
       }

  }

  loadUserData() {
    this.userData = JSON.parse(localStorage.getItem('userData'))[0];
    if(!this.userData) {
       alert("I'm sorry, but in order to review, update or delete your tasks you first need to be logged in, you'll be redirected to the login page");
       this.navCtrl.pop();
     }
  }

  updateTasks(index) {
    let currentTask = this.tasks[index];

    if(!currentTask.description) {
        this.message = "The task you're trying to update is empty please check if your changes have been written";
        this.presentToast();
    } else { }

    axios.put(`/tasks/${currentTask.id}`, {
                   description: currentTask.description,
                   isCompleted: currentTask.isCompleted,
                   userId: this.userData.id
               }).then(response => {
                     this.message = "Task updated";
                     this.presentToast();
               }).catch(error => {
                   this.message = `Task was not updated ${error}, please try again later`;
                   this.presentToast();
             });
  }

  getTasks() {

    axios.get(`/tasks?userId=${this.userData.id}&_page=${this.offSet}&_limit=5`)
            .then(response => {
               this.totalTasks = response.headers['x-total-count'];
               this.tasks = response.data;
               this.offSet++;
           }).catch(error => {
               this.message = `Tasks error: ${error}, please try again later`;
               this.presentToast();
           });
    }

  addTask() {
    let isDuplicated = this.tasks.some(task => this.newTask.description == task.description);

    if(!isDuplicated) {
        axios.post('/tasks', {
                description: this.newTask.description,
                isCompleted: this.newTask.isCompleted,
                userId: this.userData.id
              }).then(response => {
                  this.tasks.push(response.data);
                  this.message = "Task added";
                  this.presentToast();
                  this.newTask.description = "";
              }).catch(error => {
                  this.message = `Task was not updated ${error}, please try again later`;
                  this.presentToast();
              });

    } else {
          this.message = "Task already on the list, please add different one";
          this.presentToast();
      }
 }

  deleteTask(index) {
    let taskIndex = this.tasks[index].id;
    this.tasks.splice(index, 1);
    axios.delete('/tasks/' + taskIndex ).then(response => {
            this.message = "Task deleted";
            this.presentToast();
        }).catch(error => {
            this.message = error;
            this.presentToast();
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

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
