import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleCourse} from '../classes/ScheduleCourse';
import {Student} from '../classes/Student';

@Component({
  selector: 'iee-print-display',
  templateUrl: './print-display.component.html',
  styleUrls: ['./print-display.component.css']
})
export class PrintDisplayComponent implements OnInit {
  student: Student = new Student();
  schedules: Map<string, ScheduleCourse[]> = new Map<string, ScheduleCourse[]>();
  sessions: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));

      this.scheduleReader.schedule.asObservable().subscribe(schedules => {
        this.schedules = schedules;
        this.sessions = Array.from(schedules.keys());
        console.log(this.sessions);
      });

      this.scheduleReader.student.asObservable().subscribe(s => {
        this.student = s;
      });
    });
  }

  getScheduleBySessionName(sessionName: string): ScheduleCourse[] {
    if (this.schedules) {
      return this.schedules.get(sessionName);
    }

    return [];
  }

  onPrint(): void {
    window.print();
  }
}
