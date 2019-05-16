import { Component, OnInit, DoCheck } from '@angular/core';
import { AccountService } from '../service/account.service';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements DoCheck {
  cost = 0;
  value = 0;
  change = 0;
  stocks = [];

  constructor(private accountService: AccountService) { }

  /* 
  The Investments controller doesn’t accept an input binding for the list of stocks the
user has bought, so instead it implements the DoCheck lifecycle hook. 
this hook runs anytime the change detection runs.
  */
  ngDoCheck(): void {
    if (this.accountService.stocks.length !== this.stocks.length) 
      this.stocks = this.accountService.stocks;
      
    if (this.cost !== this.accountService.cost || this.value !== this.accountService.value) {
      this.cost = this.accountService.cost;
      this.value = this.accountService.value;
      this.change = this.accountService.value - this.accountService.cost;
    }
  }

  sell(index): void {
    this.accountService.sell(index);
  }
}
