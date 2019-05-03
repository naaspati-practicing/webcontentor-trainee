import { Product } from '../product/product';
import { Observable, Subject } from 'rxjs';
import { ProductsService } from './products.service';


export class DummyProductService extends ProductsService {
     private _products = [
          new Product("1", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("2", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("3", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("4", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("5", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100'),
          new Product("6", "tomato", 112.12, 100, 5, "tomato are red", true, 'https://picsum.photos/150/100')
     ];

     allProducts(): Observable<Product[]> {
          console.log("dummy get");
          return new Observable(o => o.next(this._products));
     }
     persist(product: Product): Promise<Product> {
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
                    resolve(product);
               }
          });
     }
     remove(product: Product): void {
          console.log("remove persist: ", product);
          const p = product ? this.indexOf(product) : -1;
          if (p >= 0)
               this._products.splice(p, 1);
     }

     private indexOf(product: Product): number {
          for (let n = 0; n < this._products.length; n++) {
               if (this._products[n].id === product.id)
                    return n;
          }
          return -1;
     }
}