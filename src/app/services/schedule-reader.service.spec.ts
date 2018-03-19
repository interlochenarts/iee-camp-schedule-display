import { TestBed, inject } from '@angular/core/testing';

import { ScheduleReaderService } from './schedule-reader.service';

describe('ScheduleReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScheduleReaderService]
    });
  });

  it('should be created', inject([ScheduleReaderService], (service: ScheduleReaderService) => {
    expect(service).toBeTruthy();
  }));
});
