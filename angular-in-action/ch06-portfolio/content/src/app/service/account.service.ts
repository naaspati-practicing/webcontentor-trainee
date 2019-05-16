import { Injectable } from '@angular/core';
import { Stock } from './stocks.modal';
import { LocalStorageService } from './local-storage.service';
import { AlertService } from './alert.service';
import { CurrencyPipe } from '@angular/common';


const defaultBalance = 10000;

@Injectable()
export class AccountService {
  private _balance = defaultBalance;
  private _cost = 0;
  private _value = 0;
  private _stocks: Stock[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private alertService: AlertService,
    private currencyPipe: CurrencyPipe
  ) { }

  get balance(): number { return this._balance; }
  get cost(): number { return this._cost; }
  get value(): number { return this._value; }
  get stocks(): Stock[] { return this._stocks; }

  purchase(stock: Stock): void {
    stock = Object.assign({}, stock);
    if(stock.price < this.balance) {
      this._balance = this.debit(stock.price, this.balance);
      stock.cost = stock.price;
      this._cost = this.credit(stock.price, this.cost);
      stock.change = 0;
      this._stocks.push(stock);
      this.calculateValue();
      this.cacheValues();
      this.alertService.alert(`You bought ${stock.symbol} for ` + this.currencyPipe.transform(stock.price, 'USD', true, '.2'), 'success');
    } else {
      this.alertService.alert(`You have insufficient funds to buy ${stock.symbol}`, 'danger');
    }
  }
  sell(index: number) {
    let stock = this.stocks[index];
    if(stock) {
      this._balance = this.credit(stock.price, this.balance);
      this._stocks.splice(index, 1);
      this._cost = this.debit(stock.cost, this.cost);
      this.calculateValue();
      this.cacheValues();
      this.alertService.alert(`You sold ${stock.symbol} for ` + this.currencyPipe.transform(stock.price, 'USD', true, '.2'), 'success');
    } else {
      this.alertService.alert(`You do not own the ${stock.symbol} stock.`, 'danger');
    }
  }
  init() {
    const s = this.localStorageService;
    this._stocks = s.get('stocks', []);
    this._balance = s.get('balance', defaultBalance);
    this._cost = s.get('cost', 0);
  }
  reset() {
    this._stocks = [];
    this._balance = defaultBalance;
    this._value = this._cost = 0;
    this.cacheValues();
  }
  calculateValue() {
    this._value = this._stocks
      .map(stock => stock.price)
      .reduce((a, b) => {return a + b}, 0);
  }

  private cacheValues() {
    const s = this.localStorageService;
    s.set('stocks', this.stocks);
    s.set('balance', this.balance);
    s.set('cost', this.cost);
  }
  private debit(amount: number, balance: number): number {
    return (balance * 100 - amount * 100) / 100;
  }

  private credit(amount: number, balance: number): number {
    return (balance * 100 + amount * 100) / 100;
  }

}
