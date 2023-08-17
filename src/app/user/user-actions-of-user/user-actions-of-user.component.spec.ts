import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionsOfUserComponent } from './user-actions-of-user.component';

describe('UserActionsOfUserComponent', () => {
  let component: UserActionsOfUserComponent;
  let fixture: ComponentFixture<UserActionsOfUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserActionsOfUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActionsOfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
