import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationHotelListComponent } from './destination-hotel-list.component';

describe('DestinationHotelListComponent', () => {
  let component: DestinationHotelListComponent;
  let fixture: ComponentFixture<DestinationHotelListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationHotelListComponent]
    });
    fixture = TestBed.createComponent(DestinationHotelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
