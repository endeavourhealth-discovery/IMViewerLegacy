import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRecordDialogComponent } from './health-record-dialog.component';

describe('HealthRecordDialogComponent', () => {
  let component: HealthRecordDialogComponent;
  let fixture: ComponentFixture<HealthRecordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthRecordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthRecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
