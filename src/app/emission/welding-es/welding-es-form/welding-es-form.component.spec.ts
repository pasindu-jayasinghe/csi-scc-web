import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeldingEsFormComponent } from './welding-es-form.component';

describe('WeldingEsFormComponent', () => {
  let component: WeldingEsFormComponent;
  let fixture: ComponentFixture<WeldingEsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeldingEsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeldingEsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
