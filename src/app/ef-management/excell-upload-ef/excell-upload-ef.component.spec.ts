import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcellUploadEfComponent } from './excell-upload-ef.component';

describe('ExcellUploadEfComponent', () => {
  let component: ExcellUploadEfComponent;
  let fixture: ComponentFixture<ExcellUploadEfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcellUploadEfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcellUploadEfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
