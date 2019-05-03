import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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

     allProducts(): any {
          return this._col().valueChanges();
          /*
          snapshotChanges()
               .pipe(map(items => items.map(t => {
                    const d = t.payload.doc.data();
                    d['id'] = t.payload.doc.ref;
                    return d;
               })));
          */

     }
     persist(product: Product): Promise<void> {
          return this._col().doc(product.name).set({...product});
     }
     
     private _col(): AngularFirestoreCollection {
          return this.db.collection("/products");
     }
     remove(product: Product): Promise<void> {
          return this._col().doc(product.name).delete();
     }
}