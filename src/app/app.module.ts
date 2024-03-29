import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MatrixComponent} from './matrix/matrix.component';
import {HeaderComponent} from './header/header.component';
import {PrintHeaderComponent} from './print-header/print-header.component';
import {RouterModule, Routes} from '@angular/router';
import {ScreenDisplayComponent} from './screen-display/screen-display.component';
import {PrintDisplayComponent} from './print-display/print-display.component';
import {SafeUrlPipe} from './_pipes/safe-url.pipe';
import {BatchDisplayComponent} from './batch-display/batch-display.component';
import {SafeStylePipe} from './_pipes/safe-style.pipe';
import { ListViewComponent } from './list-view/list-view.component';
import { ListItemComponent } from './list-view/list-item/list-item.component';

const appRoutes: Routes = [
  {path: 'batch', component: BatchDisplayComponent},
  {path: 'batch/c', component: BatchDisplayComponent},
  {
    path: ':educationId',
    children: [
      {path: '', redirectTo: '0', pathMatch: 'prefix'},
      {path: 'print', component: PrintDisplayComponent},
      {path: ':sessionIndex', component: ScreenDisplayComponent}
    ]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MatrixComponent,
    HeaderComponent,
    PrintHeaderComponent,
    ScreenDisplayComponent,
    PrintDisplayComponent,
    SafeUrlPipe,
    BatchDisplayComponent,
    SafeStylePipe,
    ListViewComponent,
    ListItemComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true, paramsInheritanceStrategy: 'always', relativeLinkResolution: 'legacy' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
