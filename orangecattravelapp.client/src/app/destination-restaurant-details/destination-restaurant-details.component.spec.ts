import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationRestaurantDetailsComponent } from './destination-restaurant-details.component';

describe('DestinationRestaurantDetailsComponent', () => {
  let component: DestinationRestaurantDetailsComponent;
  let fixture: ComponentFixture<DestinationRestaurantDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationRestaurantDetailsComponent]
    });
    fixture = TestBed.createComponent(DestinationRestaurantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
