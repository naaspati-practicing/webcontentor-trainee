import { Component, OnInit, OnChanges, ChangeDetectionStrategy, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricComponent implements OnChanges {
  @Input() title = '';
  @Input() description = '';
  @Input('used') value = 0;
  @Input('available') max = 100;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.check(changes.value))
      this.value = 0;
    if (this.check(changes.max))
      this.max = 0;
  }

  private check(val: any): boolean {
    return val && isNaN(val.currentValue);
  }

  isDanger() {
    return this.value / this.max > 0.7;
  }

}
