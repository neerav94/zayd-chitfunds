import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserTransactionsComponent } from './admin-user-transactions.component';

describe('AdminUserTransactionsComponent', () => {
  let component: AdminUserTransactionsComponent;
  let fixture: ComponentFixture<AdminUserTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
