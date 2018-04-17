import {Component, OnInit, ViewChild} from '@angular/core';
import {BatchSchedule} from '../_classes/BatchSchedule';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleTime} from '../_classes/ScheduleTime';

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
  @ViewChild('arrival') arrivalSelect: HTMLSelectElement;
  @ViewChild('term') termSelect: HTMLSelectElement;
  schedules: BatchSchedule[] = [];
  loadingBatch = false;
  timesByDivision = new Map<string, ScheduleTime[]>();

  constructor(private scheduleReaderService: ScheduleReaderService) {
  }

  ngOnInit() {
    this.scheduleReaderService.getCabins().then((cabins: string[]) => {
      cabins.forEach(cabin => {
        // create a select item and add to cabin select
        const selectItem: HTMLOptionElement = new Option(cabin, cabin);
        this.cabinSelect.nativeElement.add(selectItem);
      });
    });

    this.scheduleReaderService.getCampTerms().then((termsById: Map<string, string>) => {
      const keys: Array<string> = Array.from(termsById.keys());

      // sort keys based on term dates
      keys.sort((a: string, b: string) => {
        if (termsById.get(a) < termsById.get(b)) {
          return -1;
        } else if (termsById.get(a) > termsById.get(b)) {
          return 1;
        } else {
          return 0;
        }
      });

      keys.forEach(id => {
        const selectItem: HTMLOptionElement = new Option(termsById.get(id), id);
        this.termSelect.nativeElement.add(selectItem);
      });

      this.scheduleReaderService.getArrivalWeeksForTerm(keys[0]).then((arrivalWeeks: string[]) => {
        arrivalWeeks.forEach(wk => {
          const selectItem: HTMLOptionElement = new Option(wk, wk);
          this.arrivalSelect.nativeElement.add(selectItem);
        });
      });
    });

    // load the map of schedule times based on the possible student divisions
    this.scheduleReaderService.timesByDivision.asObservable().subscribe(value => {
      this.timesByDivision = value;
    });
  }

  onChangeTerm() {
    this.scheduleReaderService.getArrivalWeeksForTerm(this.termSelect.nativeElement.value).then((arrivalWeeks: string[]) => {
      arrivalWeeks.forEach(wk => {
        const selectItem: HTMLOptionElement = new Option(wk, wk);
        this.arrivalSelect.nativeElement.add(selectItem);
      });
    });
  }

  getBatchSchedule() {
    this.loadingBatch = true;
    this.schedules.length = 0;
    const fields = {
      'housingDivision': this.housingDivisionSelect.nativeElement.value,
      'cabin': this.cabinSelect.nativeElement.value,
      'division': this.divisionSelect.nativeElement.value,
      'arrivalWeek': this.arrivalSelect.nativeElement.value,
      'term': this.termSelect.nativeElement.value
    };

    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampScheduleController.getBatchOfRecords',
      JSON.stringify(fields),
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

  onSortSchedules($event, sortBy: string): void {
    this.sortSchedules(sortBy);
  }

  sortSchedules(sortBy: string): void {
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
