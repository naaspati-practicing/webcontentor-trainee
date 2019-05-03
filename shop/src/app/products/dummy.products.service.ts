import { Product } from '../product/product';
import { Observable, Subject } from 'rxjs';
import { ProductsService } from './products.service';


export class DummyProductService extends ProductsService {
     private _products = [
          new Product("tomato-1", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product( "tomato-2", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("tomato-3", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("tomato-4", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("tomato-5", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("tomato-6", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100')
     ];

     allProducts(): Observable<Product[]> {
          console.log("dummy get");
          return new Observable(o => o.next(this._products));
     }
     persist(product: Product): Promise<void> {
          console.log("dummy persist: ", product);
          return new Promise((resolve, reject) => {
               if (!product)
                    reject(new Error("null cannot be persisted"));
               else {
                    const n = this.indexOf(product);
                    if (n < 0)
                         this._products.push(product);
                    else
                         this._products[n] = product;
                    resolve();
               }
          });
     }
     remove(product: Product):  Promise<void> {
          console.log("remove persist: ", product);
          const p = product ? this.indexOf(product) : -1;
          if (p >= 0)
               this._products.splice(p, 1);
               
          return new Promise(resolve => resolve());
     }

     private indexOf(product: Product): number {
          for (let n = 0; n < this._products.length; n++) {
               if (this._products[n].name === product.name)
                    return n;
          }
          return -1;
     }
}