import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataModelOverviewLibraryComponent } from './data-model-overview-library.component';

describe('DataModelOverviewLibraryComponent', () => {
  let component: DataModelOverviewLibraryComponent;
  let fixture: ComponentFixture<DataModelOverviewLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataModelOverviewLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataModelOverviewLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
