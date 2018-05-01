import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ScheduleCourse} from '../../_classes/ScheduleCourse';
import {ScheduleTime} from '../../_classes/ScheduleTime';

@Component({
  selector: 'iee-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit, OnChanges {
  @Input() course: ScheduleCourse;
  @Input() period: number;
  @Input() day: number;
  @Input() division: string;
  @Input() timesByDivision: Map<string, ScheduleTime[]>;
  times: ScheduleTime[];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.times = this.timesByDivision.get(this.division);
  }

}
