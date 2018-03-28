import {Component, OnInit} from '@angular/core';
import {BatchSchedule} from '../_classes/BatchSchedule';

declare const Visualforce: any;

@Component({
  selector: 'iee-batch-display',
  templateUrl: './batch-display.component.html',
  styleUrls: ['./batch-display.component.css']
})
export class BatchDisplayComponent implements OnInit {
  schedules: BatchSchedule[] = [];
  loadingBatch = false;

  constructor() {
  }

  ngOnInit() {
  }

  getBatchSchedule() {
    this.loadingBatch = true;
    this.schedules.length = 0;
    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampScheduleController.getBatchOfRecords',
      'column', 'value',
      json => {
        if (json !== null) {
          const j = JSON.parse(json);
          j.forEach(s => {
            this.schedules.push(BatchSchedule.createFromJson(s));
          });
        }
        this.loadingBatch = false;
      },
      {buffer: false, escape: false}
    );
  }

  onSortSchedules($event, sortBy: string) {
    this.schedules.sort((a: BatchSchedule, b: BatchSchedule) => {

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
