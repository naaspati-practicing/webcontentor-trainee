import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product';
import { SelectedProductService } from './selected-product.service';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
 
  title = 'Product List';
  products: Product[];

  constructor(
    private db: ProductsService, 
    private sel: SelectedProductService
    ) { }
  
  remove() {
    console.log("remove");
  }
  ngOnInit(): void {
    this.db.allProducts().subscribe(p => this.products = p);
  }  

} 
