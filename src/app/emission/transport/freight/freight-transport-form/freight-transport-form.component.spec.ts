import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightTransportFormComponent } from './freight-transport-form.component';

describe('FreightTransportFormComponent', () => {
  let component: FreightTransportFormComponent;
  let fixture: ComponentFixture<FreightTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
