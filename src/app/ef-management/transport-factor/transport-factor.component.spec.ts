import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportFactorComponent } from './transport-factor.component';

describe('TransportFactorComponent', () => {
  let component: TransportFactorComponent;
  let fixture: ComponentFixture<TransportFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportFactorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
