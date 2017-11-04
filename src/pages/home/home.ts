import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  icons: string[];
  items: Array<{description: string, isCompleted: boolean}>;
  newItem: {description: string, isCompleted: boolean};

  constructor(public navCtrl: NavController) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    this.newItem = {
      description: "",
      isCompleted: false
    };
  }

  addNewItem() {
    this.items.push(
      {
        description: this.newItem.description,
        isCompleted: false
      }
    );

    this.newItem.description = "";
  }

  markAsCompleted(taskIndex) {
    if (!this.items[taskIndex].isCompleted) {
        this.items[taskIndex].isCompleted = !this.items[taskIndex].isCompleted;
    } else {
           this.items[taskIndex].isCompleted = !this.items[taskIndex].isCompleted;
            }

        //console.log(`CURRENT TASK ${taskIndex}`);
  }

  delItem(index) {
    this.items.splice(index, 1);
  }

  isCompleted = function(arr) {
    return arr.filter(task => task.isCompleted == true).length;
   }

  inProgress = function(arr) {
    return arr.filter(task => task.isCompleted == false).length;
  }

}
