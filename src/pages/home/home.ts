import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import axios from "axios"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  tasks: Array<{description: string, isCompleted: boolean, id: number}>;
  newTask: {description: string, isCompleted: boolean};

  constructor(public navCtrl: NavController) {
    this.tasks = [];
    this.getTasks();
    this.newTask = {
      description: "",
      isCompleted: false,
    };
  }

  updateTasks(index) {
    let temporaryTask = this.tasks[index];
    if(temporaryTask.description == "" || temporaryTask.description == "\n" || temporaryTask.description == "\n\n"){
        alert("The task you're trying to update is empty please check if your changes have been written");
    } else {
          axios.put('http://testing.burrow.io/tasks/' + temporaryTask.id, {
                    description: temporaryTask.description,
                    isCompleted: temporaryTask.isCompleted
                 }).then(response => {
                 }).catch(error => {
                    console.log(error);
               });
           }
  }

  getTasks() {
    axios.get('http://testing.burrow.io/tasks').then(response => {
            this.tasks = response.data;
          }).catch(erorr => {
            console.log(erorr);
        });
    }

  addTask() {
    let isDuplicated = this.tasks.some(task => this.newTask.description == task.description);
    if(!isDuplicated) {
        axios.post('http://testing.burrow.io/tasks', {
              description: this.newTask.description,
              isCompleted: this.newTask.isCompleted
           }).then(response => {
            //  console.log(response);
              this.getTasks();
           }).catch(error => {
             console.log(error);
        });

        this.newTask.description = "";
    } else {
        alert("This task is already on the list, ¿Do you want to add a different one?");
      }
 }

  deleteTask(index) {
    let taskIndex = this.tasks[index].id;
    this.tasks.splice(index, 1);
    axios.delete('http://testing.burrow.io/tasks/' + taskIndex ).then(response => {
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

}
