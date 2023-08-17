import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodologyListComponent } from './methodology-list.component';

describe('MethodologyListComponent', () => {
  let component: MethodologyListComponent;
  let fixture: ComponentFixture<MethodologyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodologyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodologyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
