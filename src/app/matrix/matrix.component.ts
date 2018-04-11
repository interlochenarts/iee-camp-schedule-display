import {Component, ElementRef, Input, OnChanges, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {ScheduleCourse} from '../_classes/ScheduleCourse';
import {ScheduleTime} from '../_classes/ScheduleTime';
import {ScheduleReaderService} from '../services/schedule-reader.service';

@Component({
  selector: 'iee-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit, OnChanges {
  @Input() sessionSchedule: ScheduleCourse[];
  @Input() division: string;
  @ViewChild('matrixContainer') matrixContainer: ElementRef;

  divs: HTMLDivElement[] = [];
  firstDay = 7;
  lastDay = -1;

  firstPeriod = 12;
  lastPeriod = -1;

  freePeriods: ScheduleCourse[] = [];

  timesByDivision: Map<string, ScheduleTime[]> = new Map<string, ScheduleTime[]>();

  private dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  gridPositionsFilled: boolean[] = [];

  getGridColumnStyle(): string {
    const days = this.lastDay - this.firstDay + 1;
    return 'grid-template-columns: 0.75fr repeat(' + days + ', 1fr);';
  }

  // makes a list of period days (integers) from the first day to the last on the schedule
  // Sun is 0 (zero)
  get periodDays(): number[] {
    return Array.from(
      {length: (this.lastDay - this.firstDay + 1)},
      (v, k) => k + this.firstDay);
  }

  // makes a list of period numbers from the first one on the schedule to the last one on the schedule
  get periodNumbers(): number[] {
    return Array.from(
      {length: (this.lastPeriod - this.firstPeriod + 1)},
      (v, k) => k + this.firstPeriod); // add the index to the first period number
  }

  // get a string representation of the start to end times for the schedule matrix
  get periodTimes(): string[] {
    if (this.division && this.timesByDivision) {
      // get a list of all the times based on the student's division
      const times: ScheduleTime[] = this.timesByDivision.get(this.division);
      if (times) {
        return times.filter((st: ScheduleTime) => {
          // filter the list based on whether we actually have a period
          return this.periodNumbers.indexOf(st.period) > -1;
        }).map((st: ScheduleTime) => {
          // return a string for the start/end times which populates an array
          return st.startTime + '<br />to<br />' + st.endTime;
        });
      }
    }

    return [];
  }

  // how many days are in the week?
  private get dayCount(): number {
    return this.lastDay - this.firstDay + 1;
  }

  getHeaderGridColumnStyle(index: number): string {
    return 'grid-column: ' + (index + 2) + ' / ' + (index + 2) + ';';
  }

  getPeriodColumnGridRowStyle(periodIndex: number): string {
    return 'grid-row: ' + (periodIndex + 2) + ' / ' + (periodIndex + 2) + ';';
  }

  getPeriodGridCellStyle(periodIndex: number): string {
    return this.getPeriodColumnGridRowStyle(periodIndex) + this.getPeriodGridColumnStyle(0);
  }

  getPeriodGridColumnStyle(index): string {
    return 'grid-column: ' + (index + 1) + ' / ' + (index + 1) + ';';
  }

  constructor(private renderer: Renderer2, private scheduleReaderService: ScheduleReaderService) {
  }

  ngOnInit() {
    // load the map of schedule times based on the possible student divisions
    this.scheduleReaderService.timesByDivision.asObservable().subscribe(value => {
      this.timesByDivision = value;
    });
  }

  ngOnChanges() {
    // each time on change, re-render the matrix divs. Remove all existing divs first.
    this.divs.forEach(div => {
      this.renderer.removeChild(this.matrixContainer.nativeElement, div);
    });
    this.updateSchedule();
  }

  updateSchedule(): void {
    if (this.sessionSchedule) {
      this.divs.length = 0;
      this.freePeriods.length = 0;
      this.firstDay = 7;
      this.lastDay = -1;
      this.firstPeriod = 12;
      this.lastPeriod = -1;
      this.sessionSchedule.forEach(c => {
        // console.log('name: ' + c.courseName + ' / days: ' + c.days.join() + ' / periods: ' + c.periods.join());
        const days = Array.from(c.scheduleViewMap.keys());

        days.forEach(d => {
          if (d < this.firstDay) {
            this.firstDay = d;
          }
          if (d > this.lastDay) {
            this.lastDay = d;
          }

          c.scheduleViewMap.get(d).forEach(p => {
            if (p < this.firstPeriod) {
              this.firstPeriod = p;
            }
            if (p > this.lastPeriod) {
              this.lastPeriod = p;
            }
          });
        });
      });

      this.periodNumbers.sort();

      this.gridPositionsFilled = Array.from(
        {length: (this.dayCount) * (this.periodNumbers.indexOf(this.lastPeriod) + 1)},
        () => {
          return false;
        });

      this.sessionSchedule.forEach(c => {
        this.createDivsForCourse(c);
        if (c.courseName.toLowerCase().includes('private')) {
          this.createPracticeHourDivs(c);
        }
      });

      // create Free Period course divs
      this.freePeriods = this.createFreePeriods();
      this.freePeriods.forEach((free: ScheduleCourse) => {
        this.createDivsForCourse(free);
      });

      this.divs.forEach(div => {
        this.renderer.appendChild(this.matrixContainer.nativeElement, div);
      });
    }
  }

  createFreePeriods(): ScheduleCourse[] {
    const freePs: ScheduleCourse[] = [];

    this.gridPositionsFilled.forEach((filled, index) => {
      if (filled === false) {
        const periodIndex = Math.floor(index / this.dayCount);
        const dayIndex = index - (periodIndex * this.dayCount) + this.periodDays[0];

        let course = freePs[dayIndex];
        if (!course) {
          course = new ScheduleCourse('Free Period');
          course.scheduleView = this.periodNumbers[periodIndex] + '(' + this.dayNames[dayIndex] + ')';
        } else {
          const view: string[] = course.scheduleView.split('(');
          course.scheduleView = view[0] + ',' + this.periodNumbers[periodIndex] + '(' + view[1];
        }

        course.setScheduleViewMap();

        freePs[dayIndex] = course;
      }
    });

    return freePs;
  }

  createDivsForCourse(course: ScheduleCourse) {
    Array.from(course.scheduleViewMap.keys()).forEach(d => {
      const dayIndex = this.periodDays.indexOf(d);
      course.scheduleViewMap.get(d).forEach(p => {
        const periodIndex = this.periodNumbers.indexOf(p);
        if (this.courseIsFirstInRange(course.scheduleViewMap, p, d)) {
          // insert div
          const div: HTMLDivElement = <HTMLDivElement>document.createElement('div');
          this.generateStyleForCourseDiv(course.scheduleViewMap, div, dayIndex, periodIndex, d, p);
          this.generateInnerHtmlForCourseDiv(course, div, false);

          this.divs.push(div);
        }

        this.setGridPositionFilled(dayIndex, periodIndex);
      });
    });
  }

  createPracticeHourDivs(course: ScheduleCourse) {
    Array.from(course.practiceHourMap.keys()).forEach(d => {
      const dayIndex = this.periodDays.indexOf(d);
      // check to see if we have a valid practice period for this day
      if (this.periodDays.indexOf(d) > -1) {
        const practiceHours = course.practiceHourMap.get(d);
        if (practiceHours) {
          practiceHours.forEach(p => {
            const periodIndex = this.periodNumbers.indexOf(p);
            if (this.courseIsFirstInRange(course.practiceHourMap, p, d)) {
              // insert div
              const div: HTMLDivElement = <HTMLDivElement>document.createElement('div');
              this.generateStyleForCourseDiv(course.practiceHourMap, div, dayIndex, periodIndex, d, p);
              this.generateInnerHtmlForCourseDiv(course, div, true);

              this.divs.push(div);
            }

            this.setGridPositionFilled(dayIndex, periodIndex);
          });
        }
      }
    });
  }

  setGridPositionFilled(dayIndex: number, periodIndex: number) {
    // Set grid position filled. Single-dimensional array.
    // To get the position, you multiply the row index (periodIndex) by the number of columns (dayCount),
    //   then add the column index (dayIndex)
    const gridPosition: number = (periodIndex * this.dayCount) + dayIndex;
    this.gridPositionsFilled[gridPosition] = true;
  }

  generateInnerHtmlForCourseDiv(course: ScheduleCourse, div: HTMLDivElement, isPracticeHour: boolean): void {
    div.innerHTML = '<p><strong>' + (isPracticeHour ? 'Practice Hour' : course.courseName) + '</strong></p>' +
      (isPracticeHour ? '' : (course.instructor ? ('<p>' + course.instructor + '</p>') : '')) +
      (isPracticeHour ? (course.practiceBuilding ? ('<p>' + course.practiceBuilding + '</p>') : '') :
        (course.location ? ('<p>' + course.location + '</p>') : ''));
  }

  generateStyleForCourseDiv(viewMap: Map<number, number[]>, div: HTMLDivElement,
                            dayIndex: number, periodIndex: number,
                            day: number, period: number) {
    // add two to get the first column/row in the grid that's not a period number or a day title
    const startingOffset = 2;
    // add three to get the column/row after the end of the element
    const endingOffset = 3;

    // add the appropriate style for the gridded element
    div.style['grid-row'] = (periodIndex + startingOffset) + ' / ' +
      (this.periodNumbers.indexOf(this.lastPeriodInRange(viewMap, period, day)) + endingOffset);

    div.style['grid-column'] = (dayIndex + startingOffset) + ' / ' + (dayIndex + endingOffset);
    div.style.padding = '5px';
    div.style.borderTop = '1px solid gray';
    if (this.lastPeriodInRange(viewMap, period, day) === this.periodNumbers[this.periodNumbers.length - 1]) {
      div.style.borderBottom = '1px solid gray';
    }
    div.style.borderLeft = '1px solid gray';
    if (day === this.lastDay) {
      div.style.borderRight = '1px solid gray';
    }
  }

  lastPeriodInRange(viewMap: Map<number, number[]>, period: number, day: number): number {
    const periods = viewMap.get(day);
    const index = periods.indexOf(period);
    for (let i = index; i < periods.length; i++) {
      if (periods[i + 1] && periods[i] + 1 !== periods[i + 1]) {
        return periods[i];
      }
    }

    return periods[periods.length - 1];
  }

  courseIsFirstInRange(viewMap: Map<number, number[]>, period: number, day: number): boolean {
    const periods = viewMap.get(day);
    const periodIndex = periods.indexOf(period);
    return periodIndex === 0 || periods[periodIndex - 1] !== period - 1;
  }
}
