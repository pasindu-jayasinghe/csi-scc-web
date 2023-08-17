import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapproachDesComponent } from './capproach-des.component';

describe('CapproachDesComponent', () => {
  let component: CapproachDesComponent;
  let fixture: ComponentFixture<CapproachDesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapproachDesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapproachDesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
