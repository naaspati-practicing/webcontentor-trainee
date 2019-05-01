import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from './product';
import { SelectedProductService } from '../products/selected-product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent {
  @Input() product: Product;
  is_selected = false;

  constructor(private sel: SelectedProductService) {}

  selected() {
    this.sel.selected = this;
  }
}
