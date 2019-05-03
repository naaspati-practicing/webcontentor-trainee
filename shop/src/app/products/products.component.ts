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
  not_selected = true;

  constructor(
    private db: ProductsService, 
    private sel: SelectedProductService
    ) { }
  
  remove() {
    this.db.remove(this.sel.selectedProduct)
    .then(() => this.sel.selected = null)
    .catch(e => console.error(e));
  }
  ngOnInit(): void {
    this.db.allProducts().subscribe(p => this.products = p);
    this.sel.subscribe(p => this.not_selected = !p);
  }  
} 
