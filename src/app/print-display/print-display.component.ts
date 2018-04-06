import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ScheduleReaderService} from '../services/schedule-reader.service';
import {ScheduleCourse} from '../_classes/ScheduleCourse';
import {Student} from '../_classes/Student';

@Component({
  selector: 'iee-print-display',
  templateUrl: './print-display.component.html',
  styleUrls: ['./print-display.component.css']
})
export class PrintDisplayComponent implements OnInit {
  student: Student = new Student();
  schedulesBySession: Map<string, ScheduleCourse[]> = new Map<string, ScheduleCourse[]>();
  sessions: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private scheduleReader: ScheduleReaderService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((p: ParamMap) => {
      this.scheduleReader.educationId.next(p.get('educationId'));

      this.scheduleReader.schedule.asObservable().subscribe(schedules => {
        this.schedulesBySession = schedules;
        this.sessions = Array.from(schedules.keys()).sort();
      });

      this.scheduleReader.student.asObservable().subscribe(s => {
        this.student = s;
      });
    });
  }

  getScheduleBySessionName(sessionName: string): ScheduleCourse[] {
    if (this.schedulesBySession) {
      return this.schedulesBySession.get(sessionName);
    }

    return [];
  }

  onPrint(): void {
    window.print();
  }
}
