import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalWaterListComponent } from './municipal-water-list.component';

describe('MunicipalWaterListComponent', () => {
  let component: MunicipalWaterListComponent;
  let fixture: ComponentFixture<MunicipalWaterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunicipalWaterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalWaterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
