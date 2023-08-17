import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcellUplodDialogComponent } from './excell-uplod-dialog.component';

describe('ExcellUplodDialogComponent', () => {
  let component: ExcellUplodDialogComponent;
  let fixture: ComponentFixture<ExcellUplodDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcellUplodDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcellUplodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
