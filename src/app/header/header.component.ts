import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../classes/Student';

@Component({
  selector: 'iee-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() student: Student;

  constructor() { }

  ngOnInit() {
  }

}
