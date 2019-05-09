import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css']
})
export class MetricComponent {
  @Input() title = '';
  @Input() description = '';
  @Input("used") value = 0;
  @Input('available') max = 100;

  isDanger() {
    return this.value / this.max > 0.7;
  }

}
