import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MatrixComponent } from './matrix/matrix.component';
import { PeriodComponent } from './matrix/period/period.component';
import { CellComponent } from './matrix/cell/cell.component';


@NgModule({
  declarations: [
    AppComponent,
    MatrixComponent,
    PeriodComponent,
    CellComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
