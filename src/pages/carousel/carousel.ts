import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-carousel',
  templateUrl: 'carousel.html'
})

export class CarouselPage {
  @ViewChild(Slides) slides: Slides;
  images: any;

  constructor() {
    this.images = [
      { url: "https://firebasestorage.googleapis.com/v0/b/todo-app-1feb3.appspot.com/o/%20H200i.jpg?alt=media&token=b2ad9168-0dad-4f1a-a83c-6ddce34cdeff", name: "H200i"},
      { url: "https://firebasestorage.googleapis.com/v0/b/todo-app-1feb3.appspot.com/o/H400i%20.jpg?alt=media&token=774b629e-6ebb-4713-bd3b-e345226b6804", name: "H400i"},
      { url: "https://firebasestorage.googleapis.com/v0/b/todo-app-1feb3.appspot.com/o/H700i.jpg?alt=media&token=ad3c7937-7341-4398-a913-2e9b66ba3453", name: "H700"},
      { url: "https://firebasestorage.googleapis.com/v0/b/todo-app-1feb3.appspot.com/o/Hale%2082%20V2.png?alt=media&token=0e43170d-8123-42e2-91db-810128ab2b5a", name: "Hale 82 V2"},
      { url: "https://firebasestorage.googleapis.com/v0/b/todo-app-1feb3.appspot.com/o/Kraken%20G12.jpg?alt=media&token=89a20b9a-1a10-4a43-9989-33c1f179e8e7", name: "Kraken G12"}
    ];
  }

}
