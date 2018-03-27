import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../_classes/Student';

@Component({
  selector: 'iee-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() student: Student;
  @Input() educationId: string;
  linkToDashboard: string;

  constructor() { }

  ngOnInit() {
    this.linkToDashboard = '/interlochen/IEE_CampLanding?Id=' + this.educationId;
  }

}
