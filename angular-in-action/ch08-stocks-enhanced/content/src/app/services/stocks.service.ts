import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const stocks: Array<string> = ['AAPL', 'GOOG', 'FB', 'AMZN', 'TWTR'];
const service: string = 'https://angular2-in-action-api.herokuapp.com';

export interface IStock {
  symbol: string;
  lastTradePriceOnly: number;
  change:number;
  changeInPercent: number;
}

export interface INews {
  url: string;
  title: string;
}

@Injectable()
export class StocksService {
  constructor(
    private http:HttpClient
  ) { }

  get() {
    return stocks;
  }
  add(stock) {
    stocks.push(stock);
    return this.get();
  }
  remove(stock) {
    stocks.splice(stocks.indexOf(stock), 1);
    return this.get();
  }

  load(symbols) {
    if(symbols) {
      return this.http.get<IStock[]>(service + '/stocks/snapshot?symbols=' + symbols.join())
    }
  }
  getNewsSnapshot(source = 'the-wall-street-journal') {
    return this.http.get<INews>(service + '/stocks/news/snapshot?source=' + source);
  }
}
