import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkRecalculateComponent } from './bulk-recalculate.component';

describe('BulkRecalculateComponent', () => {
  let component: BulkRecalculateComponent;
  let fixture: ComponentFixture<BulkRecalculateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkRecalculateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkRecalculateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
