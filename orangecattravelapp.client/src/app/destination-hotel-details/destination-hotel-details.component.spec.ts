import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationHotelDetailsComponent } from './destination-hotel-details.component';

describe('DestinationHotelDetailsComponent', () => {
  let component: DestinationHotelDetailsComponent;
  let fixture: ComponentFixture<DestinationHotelDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationHotelDetailsComponent]
    });
    fixture = TestBed.createComponent(DestinationHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
