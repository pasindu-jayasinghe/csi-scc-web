import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteDisposalListComponent } from './waste-disposal-list.component';

describe('WasteDisposalListComponent', () => {
  let component: WasteDisposalListComponent;
  let fixture: ComponentFixture<WasteDisposalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteDisposalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteDisposalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
