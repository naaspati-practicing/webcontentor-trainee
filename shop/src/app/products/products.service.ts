import { Product } from '../product/product';
import {Observable} from 'rxjs';

export class ProductsService {
     allProducts(): Observable<Product[]>  {
          throw Error();
     }
     persist(product: Product): Promise<Product> {
          throw Error();
     }
     remove(product: Product): void {
          throw Error();
     }
}