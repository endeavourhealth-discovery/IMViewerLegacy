import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataModelNavigatorComponent } from './data-model-navigator.component';

describe('DataModelNavigatorComponent', () => {
  let component: DataModelNavigatorComponent;
  let fixture: ComponentFixture<DataModelNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataModelNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataModelNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
