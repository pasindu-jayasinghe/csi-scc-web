import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsAccessControleComponent } from './es-access-controle.component';

describe('EsAccessControleComponent', () => {
  let component: EsAccessControleComponent;
  let fixture: ComponentFixture<EsAccessControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsAccessControleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsAccessControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
