import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AddEditComponent } from './add.edit/add.edit.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer.component';
import { FrontComponent } from './front.component';
import { HeaderComponent } from './header.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';
import { SelectedProductService } from './products/selected-product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from './products/products.service';
import { DummyProductService } from './products/dummy.products.service';
import { FireBaseProductsService } from './products/firebase.products.service';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductsComponent,
    FrontComponent,
    HeaderComponent,
    FooterComponent,
    AddEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule
  ],
  providers: [SelectedProductService, 
    // {useClass:DummyProductService, provide:ProductsService }
    {useClass:FireBaseProductsService, provide:ProductsService }

  ],
  bootstrap: [AppComponent, HeaderComponent, FooterComponent]
})
export class AppModule { }
