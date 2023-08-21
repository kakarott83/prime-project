import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelFormComponent } from './travel-form.component';

describe('TravelFormComponent', () => {
  let component: TravelFormComponent;
  let fixture: ComponentFixture<TravelFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelFormComponent]
    });
    fixture = TestBed.createComponent(TravelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
