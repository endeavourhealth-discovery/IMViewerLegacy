import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDialogComponent } from './member-dialog.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';

describe('MemberDialogComponent', () => {
  let component: MemberDialogComponent;
  let fixture: ComponentFixture<MemberDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [MemberDialogComponent],
        imports: [
          RouterTestingModule,
          HttpClientTestingModule,
          MatDialogModule,
          MatSnackBarModule
        ],
        providers: [{
          provide: MatDialogRef,
          useValue: {}
        }]
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
