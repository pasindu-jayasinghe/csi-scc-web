import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncinerationComponent } from './incineration.component';

describe('IncinerationComponent', () => {
  let component: IncinerationComponent;
  let fixture: ComponentFixture<IncinerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncinerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncinerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
