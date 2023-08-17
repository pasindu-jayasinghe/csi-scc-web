import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkliftsListComponent } from './forklifts-list.component';

describe('ForkliftsListComponent', () => {
  let component: ForkliftsListComponent;
  let fixture: ComponentFixture<ForkliftsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForkliftsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForkliftsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
