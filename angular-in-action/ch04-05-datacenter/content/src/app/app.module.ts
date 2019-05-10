import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavBarComponent } from './navbar/nabvar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MetricComponent } from './metric/metric.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NodesComponent } from './nodes/nodes.component';
import { NodesRowComponent } from './nodes-row/nodes-row.component'

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    DashboardComponent,
    MetricComponent,
    NodesComponent,
    NodesRowComponent 
  ],
  imports: [
    BrowserModule,
    NgbProgressbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }