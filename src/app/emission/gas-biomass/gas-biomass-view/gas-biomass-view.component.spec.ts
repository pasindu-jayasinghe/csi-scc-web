import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasBiomassViewComponent } from './gas-biomass-view.component';

describe('GasBiomassViewComponent', () => {
  let component: GasBiomassViewComponent;
  let fixture: ComponentFixture<GasBiomassViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasBiomassViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GasBiomassViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
