import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PeriodComponent } from './matrix/period/period.component';
import { HeaderComponent } from './header/header.component';
import { PrintHeaderComponent } from './print-header/print-header.component';

@NgModule({
  declarations: [
    AppComponent,
    MatrixComponent,
    PeriodComponent,
    HeaderComponent,
    PrintHeaderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
