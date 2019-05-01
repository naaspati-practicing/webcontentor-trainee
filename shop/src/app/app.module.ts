import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';
import { FrontComponent } from './front.component';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { AddEditComponent } from './add.edit/add.edit.component';

// import { AngularFireModule } from  '@angular/fire'
// import { AngularFireDatabaseModule } from  '@angular/fire/database'
//import { firebase } from 'src/environments/environment';

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
  //  AngularFireModule.initializeApp(firebase),
   // AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent, HeaderComponent, FooterComponent]
})
export class AppModule { }
