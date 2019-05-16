import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http'
import { AccountService } from './account.service';
import { Observable } from 'rxjs';
import { tap, every } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { Stock } from './stocks.modal';

@Injectable()
export class StocksInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone();
    request.headers.append('Accept', 'application/json');

    return next.handle(request)
    .pipe(tap(event => {
      if(event instanceof HttpResponse &&  event.url === ConfigService.get('api')) {
        const stocks:Stock[] = event.body;
        const symbols = this.accountService.stocks.map(s => s.symbol);
        stocks.forEach(stock => {
          this.accountService.stocks.map(item => {
            if (stock.symbol === item.symbol) {
              item.price = stock.price;
              item.change = ((stock.price * 100) - (item.cost * 100)) / 100;
            }
          });
        });
        this.accountService.calculateValue();
        return stocks;
      }
  }));
}
}
