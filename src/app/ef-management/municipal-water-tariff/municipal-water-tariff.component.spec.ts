import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalWaterTariffComponent } from './municipal-water-tariff.component';

describe('MunicipalWaterTariffComponent', () => {
  let component: MunicipalWaterTariffComponent;
  let fixture: ComponentFixture<MunicipalWaterTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunicipalWaterTariffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalWaterTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
