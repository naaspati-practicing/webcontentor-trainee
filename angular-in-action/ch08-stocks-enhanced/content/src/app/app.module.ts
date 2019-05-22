import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardHoverDirective } from './directives/card-hover.directive';
import { CardTypeDirective } from './directives/card-type.directive';
import { DelayDirective } from './directives/delay.directive';
import { ManageComponent } from './manage/manage.component';
import { ChangeDetectorPipe } from './pipes/change-detector.pipe';
import { ChangePipe } from './pipes/change.pipe';
import { NewsPipe } from './pipes/news.pipe';
import { SummaryComponent } from './summary/summary.component';
import { StocksService } from './services/stocks.service';
import { CurrencyPipe, PercentPipe } from '@angular/common';



const routes:Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'manage',
    component: ManageComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    DashboardComponent,
    ManageComponent,
    CardTypeDirective,
    CardHoverDirective,
    DelayDirective,
    ChangePipe,
    ChangeDetectorPipe,
    NewsPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    StocksService, 
    CurrencyPipe, 
    PercentPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
