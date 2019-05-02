import { all } from 'q';
import { Product } from '../product/product';
import {Observable} from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

export interface ProductService {
     allProducts(): Observable<Product[]>;
     persist(product: Product): Promise<Product>;
     remove(product: Product): void;
}