import { Component, OnInit, Input } from '@angular/core';
import { __values } from 'tslib';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css']
})
export class MetricComponent {
  
  @Input() title = '';
  @Input() description = '';
  private _value = 0;
  private _max = 100;

  isDanger() {
    return this.value / this.max > 0.7;
  }
  
  get value(): number {
    return this._value;
  }
  get max(): number {
    return this._max;
  }

  @Input("used") 
  set value(n: number) {
    this._value = this.filter(n, 0);
  }

  @Input('available') 
  set max(n: number){
    this._max = this.filter(n, 100);
  }

  private filter(n: number, if_nan: number): number {
    return isNaN(n) ? if_nan : n;
  }
}
