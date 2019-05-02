import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../product/product';
import { ProductsService } from './products.service';
import { Inject, forwardRef } from '@angular/core';


export class FireBaseProductsService extends ProductsService {
     constructor(
          @Inject(forwardRef(() => AngularFirestore)) public db: AngularFirestore
          ) {
          super();
     }

     allProducts():any  {
          console.log(this.db.collection("/products").valueChanges());
         return this.db.collection("/products").valueChanges();
     }
     persist(product: Product): Promise<Product> {
          throw Error();
     }
     remove(product: Product): void {
          throw Error();
     }
}