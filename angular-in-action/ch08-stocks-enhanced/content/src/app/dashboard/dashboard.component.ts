import { Component, OnInit } from '@angular/core';
import { IStock, StocksService } from '../services/stocks.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
stocks: IStock[];
symbols: string[];

  constructor(
    private service: StocksService
  ) { }

  ngOnInit() {
    this.symbols = this.service.get();
    this.service.load(this.symbols).subscribe(stocks => this.stocks = stocks);
  }

}
