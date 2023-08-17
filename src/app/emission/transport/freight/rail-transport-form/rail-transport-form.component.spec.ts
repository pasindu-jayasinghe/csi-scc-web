import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RailTransportFormComponent } from './rail-transport-form.component';

describe('RailTransportFormComponent', () => {
  let component: RailTransportFormComponent;
  let fixture: ComponentFixture<RailTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RailTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RailTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
