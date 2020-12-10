import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnomedLicenseDialog } from './snomed-license-dialog.component';

describe('FindConceptUsagesDialogComponent', () => {
  let component: SnomedLicenseDialog;
  let fixture: ComponentFixture<SnomedLicenseDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnomedLicenseDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnomedLicenseDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
