import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product';
// import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  title = 'Product List';
  products: Product[] = dummy();
  selected_product = null;

  constructor() { }

  ngOnInit(): void {
    //dummy().forEach(o => this.db.collection('/products').add(o));
  }
  
  selected(product: Product) {
    this.selected_product = product;
  }

  add() {
    console.log("add");
  }
  edit() {
    console.log("edit");
  }
  remove() {
    console.log("remove");
  }
  
}


function dummy(): Product[] {
  return [
    new Product("1", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
    new Product("2", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
    new Product("3", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
    new Product("4", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
    new Product("5", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
    new Product("6", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100')
  ]
}
