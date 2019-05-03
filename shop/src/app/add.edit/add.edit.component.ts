import { Component, OnInit } from '@angular/core';
import { Product } from '../product/product';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { SelectedProductService } from '../products/selected-product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-or-edit',
  templateUrl: './add.edit.component.html',
  styleUrls: ['./add.edit.component.css']
})
export class AddEditComponent implements OnInit {

  // public product: Product;
  // public editMode: boolean;

  form: FormGroup;

  constructor(
    private sel: SelectedProductService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      price: ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      available_quantity: ['', Validators.compose([Validators.required, Validators.min(0)])],
      max_quantity_per_customer: ['', Validators.compose([Validators.required, Validators.min(0)])],
      description: [''],
      isVegetarian: [''],
      imgUrl: [''],
    })
  }

  ngOnInit(): void {
    if(this.router.url.endsWith("/edit")) {
       this.form.setValue(this.sel.selectedProduct);
    }
  }
  onSubmit() {

  }

}
