import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryComponentComponent } from './library-component.component';

describe('LibraryComponentComponent', () => {
  let component: LibraryComponentComponent;
  let fixture: ComponentFixture<LibraryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
