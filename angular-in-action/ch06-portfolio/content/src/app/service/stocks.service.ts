import { Injectable } from '@angular/core';
import { Stock } from './stocks.modal';
import { ConfigService } from '../config.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StocksService {

  constructor(private http: HttpClient) { }

  getStocks() {
    return this.http.get<Array<Stock>>(ConfigService.get('api'));
  }
}