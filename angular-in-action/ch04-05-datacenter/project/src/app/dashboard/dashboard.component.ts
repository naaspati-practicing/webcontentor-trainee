import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';

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
    this._generateData();
    this.interval = interval(1500).subscribe(() => this._generateData());
  }
  private _generateData() {
    this.cluster1 = [];
    this.cluster2 = [];

    this.cpu = { used: 0, available: 0 };
    this.mem = { used: 0, available: 0 };
    for (let i = 1; i < 4; i++)
      this.cluster1.push(this.randomNode(i));
    for (let i = 4; i < 7; i++)
      this.cluster2.push(this.randomNode(i));
    this.onRefresh.emit(new Date());
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
  private randomInteger(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * max) + 1;
  }

  ngOnDestroy(): void {
    this.interval.unsubscribe();
  }
}


interface Metric {
  used: number;
  available: number;
}

interface Node {
  name: string;
  cpu: Metric;
  mem: Metric;
}