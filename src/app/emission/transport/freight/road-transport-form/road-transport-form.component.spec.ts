import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadTransportFormComponent } from './road-transport-form.component';

describe('RoadTransportFormComponent', () => {
  let component: RoadTransportFormComponent;
  let fixture: ComponentFixture<RoadTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
