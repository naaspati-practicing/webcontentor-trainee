import { Component, OnInit, OnDestroy } from '@angular/core';
import { Stock } from './service/stocks.modal';
import { Subscription, interval } from 'rxjs';
import { AccountService } from './service/account.service';
import { StocksService } from './service/stocks.service';
import { AlertService } from './service/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  refresh = true;
  stocks: Stock[] = [];
  interval: Subscription;

  constructor(
    private accountService: AccountService,
    private stockService: StocksService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.load();
    this.accountService.init();
    this.interval = interval(1500).subscribe(() => {
      if (this.refresh)
        this.load();
    });
  }
  load() {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    this.interval
  }
}
