import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteIncinerationComponent } from './waste-incineration.component';

describe('WasteIncinerationComponent', () => {
  let component: WasteIncinerationComponent;
  let fixture: ComponentFixture<WasteIncinerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteIncinerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteIncinerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
