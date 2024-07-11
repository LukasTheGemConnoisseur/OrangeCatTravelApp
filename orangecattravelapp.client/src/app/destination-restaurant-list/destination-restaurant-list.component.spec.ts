import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationRestaurantListComponent } from './destination-restaurant-list.component';

describe('DestinationRestaurantListComponent', () => {
  let component: DestinationRestaurantListComponent;
  let fixture: ComponentFixture<DestinationRestaurantListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationRestaurantListComponent]
    });
    fixture = TestBed.createComponent(DestinationRestaurantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
