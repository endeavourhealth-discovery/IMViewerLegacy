import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRecordOverviewLibraryComponent } from './health-record-overview-library.component';

describe('HealthRecordOverviewLibraryComponent', () => {
  let component: HealthRecordOverviewLibraryComponent;
  let fixture: ComponentFixture<HealthRecordOverviewLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthRecordOverviewLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthRecordOverviewLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
