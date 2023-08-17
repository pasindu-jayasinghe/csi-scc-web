import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoilerListComponent } from './boiler-list.component';

describe('BoilerListComponent', () => {
  let component: BoilerListComponent;
  let fixture: ComponentFixture<BoilerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoilerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoilerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
