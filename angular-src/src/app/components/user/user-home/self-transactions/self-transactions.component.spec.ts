import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfTransactionsComponent } from './self-transactions.component';

describe('SelfTransactionsComponent', () => {
  let component: SelfTransactionsComponent;
  let fixture: ComponentFixture<SelfTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
