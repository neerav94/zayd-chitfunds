import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureGroupViewComponent } from './future-group-view.component';

describe('FutureGroupViewComponent', () => {
  let component: FutureGroupViewComponent;
  let fixture: ComponentFixture<FutureGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutureGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
