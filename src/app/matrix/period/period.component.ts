import {Component, Input, OnInit} from '@angular/core';
import {ScheduleCourse} from '../../classes/ScheduleCourse';

@Component({
  selector: 'iee-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent implements OnInit {
  @Input() periodCourses: ScheduleCourse[];

  constructor() { }

  ngOnInit() {
  }


}
