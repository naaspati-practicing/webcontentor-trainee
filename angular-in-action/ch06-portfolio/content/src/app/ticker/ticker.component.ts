import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css'],
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        style({
          marginLeft: 0,
          opacity: 1
        }),
        animate('1000ms ease-in-out', style({
          marginLeft: '-324px',
          opacity: 0
        }))
      ] )
    ])
  ]
})
export class TickerComponent implements OnInit, OnChanges {
  @Input('stocks') _stocks = [];
  stocks = [];
  interval: Subscription;
  page = 0;

  ngOnInit() {
    this.interval = interval(3000).subscribe(() => this.nextStock());
  }
  nextStock(): void {
    this.stocks.splice(0, 1);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this._stocks.length && this.stocks.length < 30) {
      if (this.page * 100 > this._stocks.length)
        this.page = 0;
        
      let additions = this._stocks.slice(this.page * 100, (this.page + 1) * 100);
      this.stocks.push(...additions);
      this.page++;
    }
  }

}
