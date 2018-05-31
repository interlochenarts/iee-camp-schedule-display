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

  constructor() {
  }

  ngOnInit() {
  }

  getMajorName(): string {
    if (this.student.majorBySessionName) {
      return this.student.getMajorBySessionName(this.session);
    }

    return '';
  }
}
