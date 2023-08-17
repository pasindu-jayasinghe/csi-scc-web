import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelDownloadDialogComponent } from './excel-download-dialog.component';

describe('ExcelDownloadDialogComponent', () => {
  let component: ExcelDownloadDialogComponent;
  let fixture: ComponentFixture<ExcelDownloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelDownloadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
