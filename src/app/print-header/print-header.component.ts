import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../classes/Student';

@Component({
  selector: 'iee-print-header',
  templateUrl: './print-header.component.html',
  styleUrls: ['./print-header.component.css']
})
export class PrintHeaderComponent implements OnInit {
  @Input() student: Student;

  constructor() { }

  ngOnInit() {
  }

}
