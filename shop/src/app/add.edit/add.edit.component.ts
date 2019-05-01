import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product';

@Component({
  selector: 'app-add.edit',
  templateUrl: './add.edit.component.html',
  styleUrls: ['./add.edit.component.css']
})
export class AddEditComponent {
  public product: Product;
  public editMode: boolean;

  
}
