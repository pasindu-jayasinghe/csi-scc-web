import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalWaterFormComponent } from './municipal-water-form.component';

describe('MunicipalWaterFormComponent', () => {
  let component: MunicipalWaterFormComponent;
  let fixture: ComponentFixture<MunicipalWaterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunicipalWaterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalWaterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
