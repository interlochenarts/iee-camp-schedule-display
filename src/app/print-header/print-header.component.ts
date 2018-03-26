import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../classes/Student';

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

  getSessionName(): string {
    if (this.student.majorBySessionName) {
      return this.student.majorBySessionName[this.session];
    }

    return '';
  }
}