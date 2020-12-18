import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindConceptUsagesDialogComponent } from './find-concept-usages-dialog.component';

describe('FindConceptUsagesDialogComponent', () => {
  let component: FindConceptUsagesDialogComponent;
  let fixture: ComponentFixture<FindConceptUsagesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindConceptUsagesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindConceptUsagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
