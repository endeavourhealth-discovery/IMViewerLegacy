import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptHierarchyViewComponent } from './concept-hierarchy-view.component';

describe('ConceptHierarchyViewComponent', () => {
  let component: ConceptHierarchyViewComponent;
  let fixture: ComponentFixture<ConceptHierarchyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptHierarchyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptHierarchyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
