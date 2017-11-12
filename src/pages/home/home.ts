import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import axios from "axios"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  userData: {username: string, password: string, id: number};
  tasks: Array<{description: string, isCompleted: boolean, userId: number, id: number}>;
  newTask: {description: string, isCompleted: boolean};

  ionViewWillEnter() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))[0];
    this.presentLoadingDefault();
  }

  ionViewDidEnter() {
    this.getTasks();
  }

  ionViewWillLeave() {
    sessionStorage.removeItem('userData');
  }

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    this.newTask = {
      description: "",
      isCompleted: false
    };
    this.tasks = [];
  }

  updateTasks(index) {
    let temporaryTask = this.tasks[index];
    if(temporaryTask.description == "" || temporaryTask.description == "\n" || temporaryTask.description == "\n\n"){
        alert("The task you're trying to update is empty please check if your changes have been written");
    } else {
        axios.put('https://testing1.burrow.io/tasks/' + temporaryTask.id, {
                   description: temporaryTask.description,
                   isCompleted: temporaryTask.isCompleted
               }).then(response => {
                   alert("The Task has been successfully updated");
               }).catch(error => {
                  console.log(error);
             });
         }
  }

  getTasks() {
    axios.get(`https://testing1.burrow.io/tasks?userId=${this.userData.id}`).then(response => {
            this.tasks = response.data;
          }).catch(erorr => {
            console.log(erorr);
        });
    }

  addTask() {
    let isDuplicated = this.tasks.some(task => this.newTask.description == task.description);
    if(!isDuplicated) {
        axios.post('https://testing1.burrow.io/tasks', {
              description: this.newTask.description,
              isCompleted: this.newTask.isCompleted,
              userId: this.userData.id,
           }).then(response => {
              this.newTask.description = "";
              this.getTasks();
           }).catch(error => {
             console.log(error);
        });

    } else {
        alert("This task is already on the list, add a different one");
      }
 }

  deleteTask(index) {
    let taskIndex = this.tasks[index].id;
    this.tasks.splice(index, 1);
    axios.delete('https://testing1.burrow.io/tasks/' + taskIndex ).then(response => {
           alert("Task successfully deleted");
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

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Loading tasks...'
    });

    loading.present();

    setTimeout(() => {
        loading.dismiss();
    }, 3000);
  }

}
