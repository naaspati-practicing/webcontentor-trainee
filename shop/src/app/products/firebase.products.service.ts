import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../product/product';
import { ProductsService } from './products.service';
import { Inject, forwardRef } from '@angular/core';
import { map } from 'rxjs/operators';


export class FireBaseProductsService extends ProductsService {
     constructor(
          @Inject(forwardRef(() => AngularFirestore)) public db: AngularFirestore
          ) {
          super();
     }

     allProducts():any  {
         return  this.db.collection("/products").snapshotChanges()
          .pipe(map(items => items.map(t => {
               console.log(t);
               return t;
          })));
         // return this.db.collection("/products").valueChanges();
     }
     persist(product: Product): Promise<Product> {
          throw Error();
     }
     remove(product: Product): void {
          throw Error();
     }
}