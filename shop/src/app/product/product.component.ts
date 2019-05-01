import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from './product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnChanges {

  @Input() product: Product;
  @Input() selected_product: Product;
  @Output() selection = new EventEmitter<Product>();
  is_selected = false;

  selected() {
    this.selection.emit(this.product);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.is_selected === (this.product === this.selected_product))
      return;

    console.log(changes);
    this.is_selected = this.product === this.selected_product;
  }
}
