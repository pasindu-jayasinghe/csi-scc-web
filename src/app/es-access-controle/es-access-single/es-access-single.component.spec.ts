import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsAccessSingleComponent } from './es-access-single.component';

describe('EsAccessSingleComponent', () => {
  let component: EsAccessSingleComponent;
  let fixture: ComponentFixture<EsAccessSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsAccessSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsAccessSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
