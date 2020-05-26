import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphNavigatorComponent } from './graph-navigator.component';

describe('GraphNavigatorComponent', () => {
  let component: GraphNavigatorComponent;
  let fixture: ComponentFixture<GraphNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
