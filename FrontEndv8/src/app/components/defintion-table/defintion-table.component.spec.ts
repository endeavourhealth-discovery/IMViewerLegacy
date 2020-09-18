import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefintionTableComponent } from './defintion-table.component';

describe('DefintionTableComponent', () => {
  let component: DefintionTableComponent;
  let fixture: ComponentFixture<DefintionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefintionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefintionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
