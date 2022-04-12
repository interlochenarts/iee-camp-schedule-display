import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BatchSchedule} from '../_classes/BatchSchedule';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleTime} from '../_classes/ScheduleTime';
import {Router} from '@angular/router';

declare const Visualforce: any;

@Component({
  selector: 'iee-batch-display',
  templateUrl: './batch-display.component.html',
  styleUrls: ['./batch-display.component.css']
})
export class BatchDisplayComponent implements OnInit {
  @ViewChild('cabin', { static: true }) cabinSelect: ElementRef;
  @ViewChild('division', { static: true }) divisionSelect: ElementRef;
  @ViewChild('housingDivision', { static: true }) housingDivisionSelect: ElementRef;
  @ViewChild('arrival', { static: true }) arrivalSelect: ElementRef;
  @ViewChild('term', { static: true }) termSelect: ElementRef;
  @ViewChild('session', { static: true }) sessionSelect: ElementRef;
  schedules: BatchSchedule[] = [];
  loadingBatch = false;
  timesByDivision = new Map<string, ScheduleTime[]>();
  alt = false;

  constructor(private router: Router, private scheduleReaderService: ScheduleReaderService) {
  }

  get uniqueStudentCount(): number {
    if (this.schedules && this.schedules.length > 0) {
      const ids: Set<string> = new Set<string>();
      this.schedules.forEach((bs: BatchSchedule) => {
        ids.add(bs.student.id);
      });

      return ids.size;
    } else {
      return 0;
    }
  }

  ngOnInit() {
    if (this.router.url.endsWith('/c')) {
      this.alt = true;
    }

    this.scheduleReaderService.getCampTerms().then((termsById: Map<string, string>) => {
      const keys: Array<string> = Array.from(termsById.keys());

      // sort keys based on term dates
      keys.sort((a: string, b: string) => {
        if (termsById.get(a) < termsById.get(b)) {
          return 1;
        } else if (termsById.get(a) > termsById.get(b)) {
          return -1;
        } else {
          return 0;
        }
      });

      this.termSelect.nativeElement.length = 0;
      keys.forEach(id => {
        const selectItem: HTMLOptionElement = new Option(termsById.get(id), id);
        this.termSelect.nativeElement.add(selectItem);
      });

      this.updateCabinsByTerm(keys[0]);
    });

    // load the map of schedule times based on the possible student divisions
    this.scheduleReaderService.timesByDivision.asObservable().subscribe(value => {
      this.timesByDivision = value;
    });
  }

  onChangeTerm(): void {
    this.updateCabinsByTerm(this.termSelect.nativeElement.value);
  }

  updateCabinsByTerm(termId: string): void {
    this.cabinSelect.nativeElement.length = 1;
    this.scheduleReaderService.getCabins(termId).then((cabins: string[]) => {
      cabins.forEach(cabin => {
        // create a select item and add to cabin select
        const selectItem: HTMLOptionElement = new Option(cabin, cabin);
        this.cabinSelect.nativeElement.add(selectItem);
      });
    });
  }

  getBatchSchedule() {
    this.loadingBatch = true;
    this.schedules.length = 0;

    // get a list of selected options in the list of cabins
    const selectedCabins: string[] = Array.apply(null, this.cabinSelect.nativeElement.options)
      .filter(opt => opt.selected).map(opt => opt.value);

    const fields = {
      'housingDivision': this.housingDivisionSelect.nativeElement.value,
      'cabin': selectedCabins,
      'division': this.divisionSelect.nativeElement.value,
      'arrivalWeek': this.arrivalSelect.nativeElement.value,
      'term': this.termSelect.nativeElement.value,
      'session': this.sessionSelect.nativeElement.value
    };

    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampScheduleBatchController.getBatchOfRecords',
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

  print(): void {
    window.print();
  }
}
