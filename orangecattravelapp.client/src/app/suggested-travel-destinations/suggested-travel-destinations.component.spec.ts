import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedTravelDestinationsComponent } from './suggested-travel-destinations.component';

describe('SuggestedTravelDestinationsComponent', () => {
  let component: SuggestedTravelDestinationsComponent;
  let fixture: ComponentFixture<SuggestedTravelDestinationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestedTravelDestinationsComponent]
    });
    fixture = TestBed.createComponent(SuggestedTravelDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
