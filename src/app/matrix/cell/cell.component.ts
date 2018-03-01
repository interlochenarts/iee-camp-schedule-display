import {Component, Input, OnInit} from '@angular/core';
import {ScheduleCourse} from '../../classes/ScheduleCourse';

@Component({
  selector: 'iee-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() course: ScheduleCourse;

  constructor() { }

  ngOnInit() {
  }

}
