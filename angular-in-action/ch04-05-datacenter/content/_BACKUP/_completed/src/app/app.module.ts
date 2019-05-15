import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { NavBarComponent } from './navbar/nabvar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MetricComponent } from './metric/metric.component';
import { NgbProgressbarModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NodesComponent } from './nodes/nodes.component';
import { NodesRowComponent } from './nodes-row/nodes-row.component';
import { AlertComponent } from './alert/alert.component';
import { NodesDetailComponent } from './nodes-detail/nodes-detail.component'

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    DashboardComponent,
    MetricComponent,
    NodesComponent,
    NodesRowComponent,
    NodesDetailComponent,
    AlertComponent
  ],
  entryComponents: [
    NodesDetailComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
