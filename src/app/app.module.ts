import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MatrixComponent} from './matrix/matrix.component';
import {PeriodComponent} from './matrix/period/period.component';
import {HeaderComponent} from './header/header.component';
import {PrintHeaderComponent} from './print-header/print-header.component';
import {RouterModule, Routes} from '@angular/router';
import {ScreenDisplayComponent} from './screen-display/screen-display.component';
import {PrintDisplayComponent} from './print-display/print-display.component';
import {SafeUrlPipe} from './safe-url.pipe';
import {BatchDisplayComponent} from './batch-display/batch-display.component';

const appRoutes: Routes = [
  {path: 'batch', component: BatchDisplayComponent},
  {
    path: ':educationId',
    children: [
      {path: '', redirectTo: '0', pathMatch: 'prefix'},
      {path: 'print', component: PrintDisplayComponent},
      {path: ':termIndex', component: ScreenDisplayComponent}
    ]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MatrixComponent,
    PeriodComponent,
    HeaderComponent,
    PrintHeaderComponent,
    ScreenDisplayComponent,
    PrintDisplayComponent,
    SafeUrlPipe,
    BatchDisplayComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {useHash: true, paramsInheritanceStrategy: 'always'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
