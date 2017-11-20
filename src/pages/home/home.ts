import { Component } from '@angular/core';
import { NavController, LoadingController, MenuController, ToastController } from 'ionic-angular';
import axios from "axios"
axios.defaults.baseURL = 'https://of7anpsi.burrow.io/';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  message: string;
  userData: any;
  tasks: Array<{description: string, isCompleted: boolean, userId: number, id: number}>;
  newTask: {description: string, isCompleted: boolean};

  ionViewWillEnter() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))[0];
    if(!this.userData) {
       alert("I'm sorry, but in order to review, update or delete your tasks you first need to be logged in, you'll be redirected to the login page");
       this.navCtrl.pop();
     }
  }

  ionViewDidEnter() {
    if(this.userData){
        this.getTasks();
       }
    }

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public toastCtrl: ToastController) {
    this.tasks = [];
    this.newTask = { description: "", isCompleted: false };
    this.openMenu();
}

  updateTasks(index) {
    let temporaryTask = this.tasks[index];
    if(temporaryTask.description == "" || temporaryTask.description == "\n" || temporaryTask.description == "\n\n") {
        this.message = "The task you're trying to update is empty please check if your changes have been written";
        this.presentToast();
    } else {
        axios.put(`/tasks/${temporaryTask.id}`, {
                   description: temporaryTask.description,
                   isCompleted: temporaryTask.isCompleted,
                   userId: this.userData.id
               }).then(response => {
                     this.message = "Task updated";
                     this.presentToast();
               }).catch(error => {
                  alert(`Task was not updated ${error}, please try again later`);
             });
         }
  }

  getTasks() {
    axios.get(`/tasks?userId=${this.userData.id}`)
            .then(response => {
               this.tasks = response.data;
           }).catch(error => {
            alert(`Tasks error: ${error}, please try again later`);
        });
    }

  addTask() {
    let isDuplicated = this.tasks.some(task => this.newTask.description == task.description);
    if(!isDuplicated) {
        axios.post('/tasks', {
                description: this.newTask.description,
                isCompleted: this.newTask.isCompleted,
                userId: this.userData.id
              })
             .then(response => {
                this.message = "Task added";
                this.presentToast();
                this.newTask.description = "";
                this.getTasks();
             }).catch(error => {
               console.log(error);
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
           console.log(error);
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
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
