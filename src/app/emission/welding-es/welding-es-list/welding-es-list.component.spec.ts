import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeldingEsListComponent } from './welding-es-list.component';

describe('WeldingEsListComponent', () => {
  let component: WeldingEsListComponent;
  let fixture: ComponentFixture<WeldingEsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeldingEsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeldingEsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
