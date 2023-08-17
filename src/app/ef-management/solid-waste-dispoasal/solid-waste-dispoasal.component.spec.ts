import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolidWasteDispoasalComponent } from './solid-waste-dispoasal.component';

describe('SolidWasteDispoasalComponent', () => {
  let component: SolidWasteDispoasalComponent;
  let fixture: ComponentFixture<SolidWasteDispoasalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolidWasteDispoasalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolidWasteDispoasalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
