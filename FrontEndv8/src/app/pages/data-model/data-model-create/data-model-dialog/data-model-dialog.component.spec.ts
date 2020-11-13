import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataModelDialogComponent } from './data-model-dialog.component';

describe('DataModelDialogComponent', () => {
  let component: DataModelDialogComponent;
  let fixture: ComponentFixture<DataModelDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataModelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataModelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
