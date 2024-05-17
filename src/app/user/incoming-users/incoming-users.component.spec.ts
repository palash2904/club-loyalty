import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingUsersComponent } from './incoming-users.component';

describe('IncomingUsersComponent', () => {
  let component: IncomingUsersComponent;
  let fixture: ComponentFixture<IncomingUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomingUsersComponent]
    });
    fixture = TestBed.createComponent(IncomingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
