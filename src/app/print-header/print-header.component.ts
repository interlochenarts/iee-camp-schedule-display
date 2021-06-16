import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../_classes/Student';

@Component({
  selector: 'iee-print-header',
  templateUrl: './print-header.component.html',
  styleUrls: ['./print-header.component.css']
})
export class PrintHeaderComponent implements OnInit {
  @Input() student: Student;
  @Input() session: string;
  weekNamesBySession = new Map<string, string>();

  constructor() {
  }

  ngOnInit() {
    this.weekNamesBySession.set('1 week', 'Week 0');
    this.weekNamesBySession.set('1st 3 weeks', 'Weeks 1-3');
    this.weekNamesBySession.set('1st 2 weeks', 'Weeks 1 & 2');
    this.weekNamesBySession.set('2nd 3 weeks', 'Weeks 4-6');
    this.weekNamesBySession.set('2nd 4 weeks', 'Weeks 1-4');
    this.weekNamesBySession.set('2nd 2 weeks', 'Weeks 3 & 4');
    this.weekNamesBySession.set('6 weeks', 'Weeks 1-6');
    this.weekNamesBySession.set('3rd 4 weeks', 'Weeks 3-6');
  }

  getMajorName(): string {
    if (this.student.majorBySessionName) {
      return this.student.getMajorBySessionName(this.session);
    }

    return '';
  }
}
