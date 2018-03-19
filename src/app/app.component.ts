import {Component, Input, OnInit} from '@angular/core';
import {ScheduleReaderService} from './services/schedule-reader.service';

@Component({
  selector: 'iee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ScheduleReaderService]
})
export class AppComponent  {
}
