import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetTableComponent } from './valueset-table.component';

describe('ValuesetTableComponent', () => {
  let component: ValuesetTableComponent;
  let fixture: ComponentFixture<ValuesetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
