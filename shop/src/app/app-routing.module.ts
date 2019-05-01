import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { FrontComponent } from './front.component';
import { AddEditComponent } from './add.edit/add.edit.component';

const routes: Routes = [ {
  path: "products",
  component: ProductsComponent
},
{
  path:'home',
  component: FrontComponent
},
{
  path:'add',
  component: AddEditComponent
},
{
  path:'edit',
  component: AddEditComponent
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
