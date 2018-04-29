import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveGroupViewComponent } from './active-group-view.component';

describe('ActiveGroupViewComponent', () => {
  let component: ActiveGroupViewComponent;
  let fixture: ComponentFixture<ActiveGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
