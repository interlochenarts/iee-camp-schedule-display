import {Component, OnInit} from '@angular/core';
import {StudentSchedule} from '../_classes/StudentSchedule';

@Component({
  selector: 'iee-batch-display',
  templateUrl: './batch-display.component.html',
  styleUrls: ['./batch-display.component.css']
})
export class BatchDisplayComponent implements OnInit {
  studentSchedules: StudentSchedule[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  onSortSchedules($event, sortBy: string) {
    this.studentSchedules.sort((a: StudentSchedule, b: StudentSchedule) => {

      switch (sortBy) {
        case 'lastName': {
          return a.student.lastName - b.student.lastName;
        }
        case 'cabin': {
          return a.student.cabin - b.student.cabin;
        }
        case 'division': {
          return a.student.division - b.student.division;
        }
        case 'housing': {
          return 0; // TODO: need to find out if we're getting housing division separately from division
        }
        default: {
          return 0;
        }
      }
    });
  }
}
