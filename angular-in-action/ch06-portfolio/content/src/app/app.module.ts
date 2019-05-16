import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from './alert/alert.component';
import { StocksComponent } from './stocks/stocks.component';
import { TickerComponent } from './ticker/ticker.component';
import { InvestmentsComponent } from './investments/investments.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StocksInterceptor } from './service/interceptor.service';
import { CurrencyPipe } from '@angular/common';
import { AlertService } from './service/alert.service';
import { LocalStorageService } from './service/local-storage.service';
import { AccountService } from './service/account.service';
import { StocksService } from './service/stocks.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    StocksComponent,
    TickerComponent,
    InvestmentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ClarityModule,
    BrowserAnimationsModule,
  ],
  providers: [
    StocksService,
    CurrencyPipe,
    AlertService,
    LocalStorageService,
    AccountService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StocksInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
