import { ComponentFixture, TestBed } from '@angular/core/testing';


import { DownstreamLeasedAssetsViewComponent } from './downstream-leased-assets-view.component';

describe('GeneratorViewComponent', () => {
  let component: DownstreamLeasedAssetsViewComponent;
  let fixture: ComponentFixture<DownstreamLeasedAssetsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownstreamLeasedAssetsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownstreamLeasedAssetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
