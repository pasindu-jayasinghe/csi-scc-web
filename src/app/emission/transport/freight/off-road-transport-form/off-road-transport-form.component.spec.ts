import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffRoadTransportFormComponent } from './off-road-transport-form.component';

describe('OffRoadTransportFormComponent', () => {
  let component: OffRoadTransportFormComponent;
  let fixture: ComponentFixture<OffRoadTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffRoadTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffRoadTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
