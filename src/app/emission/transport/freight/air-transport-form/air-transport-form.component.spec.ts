import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirTransportFormComponent } from './air-transport-form.component';

describe('AirTransportFormComponent', () => {
  let component: AirTransportFormComponent;
  let fixture: ComponentFixture<AirTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
