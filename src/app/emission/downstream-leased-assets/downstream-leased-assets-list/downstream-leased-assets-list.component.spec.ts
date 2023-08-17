import { ComponentFixture, TestBed } from '@angular/core/testing';


import { DownstreamLeasedAssetsListComponent } from './downstream-leased-assets-list.component';

describe('GeneratorListComponent', () => {
  let component: DownstreamLeasedAssetsListComponent;
  let fixture: ComponentFixture<DownstreamLeasedAssetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownstreamLeasedAssetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownstreamLeasedAssetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
