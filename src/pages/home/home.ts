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
  message: string;
  userData: any;
  updateTaskData: string;
  tasks: Array<{description: string, isCompleted: boolean, userId: number, id: number}>;
  newTask: {description: string, isCompleted: boolean};

  ionViewWillEnter() {
  /*  this.userData = JSON.parse(sessionStorage.getItem('userData'))[0];
    if(!this.userData) {
       alert("I'm sorry, but in order to review, update or delete your tasks you first need to be logged in, you'll be redirected to the login page");
       this.navCtrl.pop();
     } */
  }

  ionViewDidEnter() {
  /*  if(this.userData){
        this.getTasks();
      } */
        this.getTasks();
    }

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public toastCtrl: ToastController) {
   this.tasks = [];
    this.newTask = { description: "", isCompleted: false };
    this.openMenu();
    this.updateTaskData = "";

}

  doInfinite(infiniteScroll) {

      setTimeout(() => {

        let maximunTasks = 0;

        if (this.tasks.length != maximunTasks) {

          axios.get(`/tasks?userId=10&_page=${this.offSet}&_limit=5`)
          .then(response => {
              maximunTasks = response.headers['x-total-count'];
              let data = response.data;
              data.forEach(val => { this.tasks.push(val); })
              this.offSet++;
          }).catch(error => {
              this.message =`Tasks error: ${error}, please try again later`;
              this.presentToast();
          });

          infiniteScroll.complete();

        } else {

          infiniteScroll.enable(false);
        }

      }, 500);

  }

  updateTasks(index, descriptionUpdate) {

    alert(descriptionUpdate);
    let currentTask = this.tasks[index];
  /*  if(!currentTask.description) {
        this.message = "The task you're trying to update is empty please check if your changes have been written";
        this.presentToast();
    } else {
        axios.put(`/tasks/${currentTask.id}`, {
                   description: description,
                   isCompleted: currentTask.isCompleted,
                   userId: 10
               }).then(response => {
                     alert(JSON.stringify(response.data));
                     this.message = "Task updated";
                     this.presentToast();
               }).catch(error => {
                   this.message = `Task was not updated ${error}, please try again later`;
                   this.presentToast();
             });
         } */
  }

  getTasks() {
    //axios.get(`/tasks?userId=${this.userData.id}&_limit`)
    axios.get(`/tasks?userId=10&_page=${this.offSet}&_limit=5`)
            .then(response => {
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
                userId: 10
              })
             .then(response => {
                this.message = "Task added";
                this.presentToast();
                this.newTask.description = "";
                //this.getTasks();
              })
              .catch(error => {
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
