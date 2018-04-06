import {Component, ElementRef, Input, OnChanges, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {ScheduleCourse} from '../_classes/ScheduleCourse';

@Component({
  selector: 'iee-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit, OnChanges {
  @Input() termSchedule: ScheduleCourse[];
  @ViewChild('matrixContainer') matrixContainer: ElementRef;

  divs: HTMLDivElement[] = [];
  firstDay = 7;
  lastDay = -1;

  firstPeriod = 12;
  lastPeriod = -1;

  freePeriods: ScheduleCourse[] = [];

  private dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  gridPositionsFilled: boolean[] = [];

  getGridColumnStyle(): string {
    const days = this.lastDay - this.firstDay + 1;
    return 'grid-template-columns: 0.75fr repeat(' + days + ', 1fr);';
  }

  get periodDays(): number[] {
    return Array.from(
      {length: (this.lastDay - this.firstDay + 1)},
      (v, k) => k + this.firstDay);
  }

  get periodNumbers(): number[] {
    return Array.from(
      {length: (this.lastPeriod - this.firstPeriod + 1)},
      (v, k) => k + this.firstPeriod);
  }

  get periodTimes(): string[] {
    return Array.from(
      {length: (this.lastPeriod - this.firstPeriod + 1)},
      (v, index) => {
        let hour = index + this.firstPeriod + 7;
        const meridiem = hour >= 12 ? ' PM' : ' AM';
        if (hour > 12) {
          hour -= 12;
        }
        return hour + meridiem;
      });
  }

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

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.divs.forEach(div => {
      this.renderer.removeChild(this.matrixContainer.nativeElement, div);
    });
    this.updateSchedule();
  }

  updateSchedule(): void {
    if (this.termSchedule) {
      this.divs.length = 0;
      this.freePeriods.length = 0;
      this.firstDay = 7;
      this.lastDay = -1;
      this.firstPeriod = 12;
      this.lastPeriod = -1;
      this.termSchedule.forEach(c => {
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

      this.termSchedule.forEach(c => {
        this.createDivsForCourse(c);
      });

      // create Free Period course divs
      this.freePeriods = this.createFreePeriods();
      this.freePeriods.forEach(free => {
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
        const dayIndex = index - (periodIndex * this.dayCount) + 1;

        let course = freePs[dayIndex];
        if (!course) {
          course = new ScheduleCourse('Free Period');
          course.scheduleView =  this.periodNumbers[periodIndex] + '(' + this.dayNames[dayIndex] + ')';
        } else {
          const view: string[] = course.scheduleView.split('(');
          course.scheduleView = view[0] + ',' + this.periodNumbers[periodIndex] + '(' + view[1];
        }

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
        if (this.courseIsFirstInRange(course, p, d)) {
          // insert div
          const div: HTMLDivElement = <HTMLDivElement>document.createElement('div');
          div.style['grid-row'] = (periodIndex + 2) + ' / ' + (this.periodNumbers.indexOf(this.lastPeriodInRange(course, p, d)) + 3);
          div.style['grid-column'] = (dayIndex + 2) + ' / ' + (dayIndex + 3);
          div.style.padding = '5px';
          div.style.borderTop = '1px solid gray';
          if (this.lastPeriodInRange(course, p, d) === this.periodNumbers[this.periodNumbers.length - 1]) {
            div.style.borderBottom = '1px solid gray';
          }
          div.style.borderLeft = '1px solid gray';
          if (d === this.lastDay) {
            div.style.borderRight = '1px solid gray';
          }
          div.innerHTML = '<p><strong>' + course.courseName + '</strong></p>' +
            (course.instructor ? ('<p>' + course.instructor + '</p>') : '') +
            (course.location ? ('<p>' + course.location + '</p>') : '');

          this.divs.push(div);
        }

        // set position filled
        const gridPosition: number = (periodIndex * this.dayCount) + dayIndex;
        this.gridPositionsFilled[gridPosition] = true;
      });
    });

  }

  lastPeriodInRange(course: ScheduleCourse, period: number, day: number): number {
    const periods = course.scheduleViewMap.get(day);
    const index = periods.indexOf(period);
    for (let i = index; i < periods.length; i++) {
      if (periods[i + 1] && periods[i] + 1 !== periods[i + 1]) {
        return periods[i];
      }
    }

    return periods[periods.length - 1];
  }

  courseIsFirstInRange(course: ScheduleCourse, period: number, day: number): boolean {
    const periods = course.scheduleViewMap.get(day);
    const periodIndex = periods.indexOf(period);
    return periodIndex === 0 || periods[periodIndex - 1] !== period - 1;
  }
}
