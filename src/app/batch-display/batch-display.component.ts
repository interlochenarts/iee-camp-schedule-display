import {Component, OnInit, ViewChild} from '@angular/core';
import {BatchSchedule} from '../_classes/BatchSchedule';

declare const Visualforce: any;

@Component({
  selector: 'iee-batch-display',
  templateUrl: './batch-display.component.html',
  styleUrls: ['./batch-display.component.css']
})
export class BatchDisplayComponent implements OnInit {
  @ViewChild('cabin') cabinSelect: HTMLSelectElement;
  @ViewChild('division') divisionSelect: HTMLSelectElement;
  @ViewChild('housingDivision') housingDivisionSelect: HTMLSelectElement;
  @ViewChild('arrivalWeek') arrivalSelect: HTMLSelectElement;
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
          if (a.student.lastName < b.student.lastName) {
            return -1;
          } else if (a.student.lastName > b.student.lastName) {
            return 1;
          } else {
            return 0;
          }
        }
        case 'cabin': {
          if (a.student.cabin < b.student.cabin) {
            return -1;
          } else if (a.student.cabin > b.student.cabin) {
            return 1;
          } else {
            return 0;
          }
        }
        case 'division': {
          if (a.student.division < b.student.division) {
            return -1;
          } else if (a.student.division > b.student.division) {
            return 1;
          } else {
            return 0;
          }
        }
        case 'housing': {
          if (a.student.housingDivision < b.student.housingDivision) {
            return -1;
          } else if (a.student.housingDivision > b.student.housingDivision) {
            return 1;
          } else {
            return 0;
          }
        }
        default: {
          return 0;
        }
      }
    });
  }
}
