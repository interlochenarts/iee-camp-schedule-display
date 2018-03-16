import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDisplayComponent } from './print-display.component';

describe('PrintDisplayComponent', () => {
  let component: PrintDisplayComponent;
  let fixture: ComponentFixture<PrintDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
