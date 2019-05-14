import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  cpu: Metric;
  mem: Metric;
  cluster1: Node[];
  cluster2: Node[];
  interval: Subscription;
  @Output() onRefresh = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
    this.generateData();
    this.interval = interval(1500).subscribe(() => this.generateData());
  }
  ngOnDestroy() {
    this.interval.unsubscribe();
  }
  public generateData() {
    this.cpu = { used: 0, available: 0 };
    this.mem = { used: 0, available: 0 };

    this.cluster1 = this.genCluster(4);
    this.cluster2 = this.genCluster(7);
  }
 private genCluster(size: number): Node[] {
    const array = new Array(size);
    for (let n = 0; n < array.length; n++)
      array[n] = this.randomNode(n);
    return array;
  }

  private randomInteger(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * max) + 1;
  }

  private randomNode(i: number): Node {
    let node = {
      name: 'node' + i,
      cpu: { available: 16, used: this.randomInteger(0, 16) },
      mem: { available: 48, used: this.randomInteger(0, 48) }
    };
    this.cpu.used += node.cpu.used;
    this.cpu.available += node.cpu.available;
    this.mem.used += node.mem.used;
    this.mem.available += node.mem.available;
    return node;
  }

}

interface Node {
  name: string;
  cpu: Metric;
  mem: Metric;
}

interface Metric {
  used: number;
  available: number;
}
