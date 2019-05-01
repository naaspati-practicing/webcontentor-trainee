import { Injectable, OnInit } from '@angular/core';
import { Product } from '../product/product';
import { ProductComponent } from '../product/product.component';

@Injectable()
export class SelectedProductService {
  private _selected: ProductComponent = null;

  get selectedProduct(): Product {
    return this._selected === null ? null : this._selected.product;
  }

  set selected(component: ProductComponent) {
    if (this._selected)
      this._selected.is_selected = false;

    this._selected = component;
    this._selected.is_selected = true;
  }
}
