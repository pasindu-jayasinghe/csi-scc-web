import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasBiomassListComponent } from './gas-biomass-list.component';

describe('GasBiomassListComponent', () => {
  let component: GasBiomassListComponent;
  let fixture: ComponentFixture<GasBiomassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasBiomassListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GasBiomassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
