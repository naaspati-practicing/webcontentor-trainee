import { Injectable, OnInit } from '@angular/core';
import { Product } from '../product/product';
import { ProductComponent } from '../product/product.component';
import { EventEmitter } from 'events';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SelectedProductService {
  private _selected: ProductComponent = null;
  readonly _event = new Subject<ProductComponent>();

  get selectedProduct(): Product {
    return this._selected === null ? null : this._selected.product;
  }

  set selected(component: ProductComponent) {
    if (this._selected)
      this._selected.is_selected = false;

    this._selected = component;
    if (component !== null)
      this._selected.is_selected = true;
    
    this._event.next(component);
  }

  subscribe(t:(ProductComponent) => void) {
    this._event.subscribe(t);
  }
}
