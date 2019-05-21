import { Component, OnInit } from '@angular/core';
import { StocksService } from '../services/stocks.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent {
  symbols: string[];
  stock: string;

  constructor(
    private service: StocksService
  ) { 
    this.symbols = this.service.get();
  }

  add() {
    this.symbols.push(this.stock.toUpperCase());
    this.stock = '';
  }
  remove(symbol) {
    this.symbols = this.service.remove(symbol);
  }
}
