import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRecordNavigatorComponent } from './health-record-navigator.component';

describe('HealthRecordNavigatorComponent', () => {
  let component: HealthRecordNavigatorComponent;
  let fixture: ComponentFixture<HealthRecordNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthRecordNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthRecordNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
