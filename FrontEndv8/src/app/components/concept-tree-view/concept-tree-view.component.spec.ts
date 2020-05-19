import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptTreeViewComponent } from './concept-tree-view.component';

describe('ConceptTreeViewComponent', () => {
  let component: ConceptTreeViewComponent;
  let fixture: ComponentFixture<ConceptTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
