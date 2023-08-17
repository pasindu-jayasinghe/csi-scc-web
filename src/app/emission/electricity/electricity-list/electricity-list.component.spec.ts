import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityListComponent } from './electricity-list.component';

describe('ElectricityListComponent', () => {
  let component: ElectricityListComponent;
  let fixture: ComponentFixture<ElectricityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
