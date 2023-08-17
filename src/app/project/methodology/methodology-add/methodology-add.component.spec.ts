import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodologyAddComponent } from './methodology-add.component';

describe('MethodologyAddComponent', () => {
  let component: MethodologyAddComponent;
  let fixture: ComponentFixture<MethodologyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodologyAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodologyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
