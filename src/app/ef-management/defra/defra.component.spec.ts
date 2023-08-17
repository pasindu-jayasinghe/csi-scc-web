import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefraComponent } from './defra.component';

describe('DefraComponent', () => {
  let component: DefraComponent;
  let fixture: ComponentFixture<DefraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
