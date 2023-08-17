import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportUserComponent } from './import-export-user.component';

describe('ImportExportUserComponent', () => {
  let component: ImportExportUserComponent;
  let fixture: ComponentFixture<ImportExportUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExportUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
