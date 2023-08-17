import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterTransportFormComponent } from './water-transport-form.component';

describe('WaterTransportFormComponent', () => {
  let component: WaterTransportFormComponent;
  let fixture: ComponentFixture<WaterTransportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterTransportFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterTransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
