import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WasteGeneratedInOperationsFormComponent } from './waste-generated-in-operations-form.component';


describe('WasteGeneratedInOperationsFormComponent', () => {
  let component: WasteGeneratedInOperationsFormComponent;
  let fixture: ComponentFixture<WasteGeneratedInOperationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteGeneratedInOperationsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteGeneratedInOperationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
