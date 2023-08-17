import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteDisposalFormComponent } from './waste-disposal-form.component';

describe('WasteDisposalFormComponent', () => {
  let component: WasteDisposalFormComponent;
  let fixture: ComponentFixture<WasteDisposalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteDisposalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteDisposalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
