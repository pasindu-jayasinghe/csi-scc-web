import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownstreamLeasedAssetsFormComponent } from './downstream-leased-assets-form.component';


describe('DownstreamLeasedAssetsFormComponent', () => {
  let component: DownstreamLeasedAssetsFormComponent;
  let fixture: ComponentFixture<DownstreamLeasedAssetsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownstreamLeasedAssetsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownstreamLeasedAssetsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
