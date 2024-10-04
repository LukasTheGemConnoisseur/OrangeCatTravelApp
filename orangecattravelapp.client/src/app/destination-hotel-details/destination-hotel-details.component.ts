import { Component } from '@angular/core';

@Component({
  selector: 'app-destination-hotel-details',
  templateUrl: './destination-hotel-details.component.html',
  styleUrls: ['./destination-hotel-details.component.css']
})
export class DestinationHotelDetailsComponent {
  destinationName: string = "Wisconsin Dells" // Default value
  hotelName: string = "Atlantis Family Waterpark Hotel" // Default value
  hotelRating: number = 4.0 // Default value
  hotelReviewNumber: number = 152 // Default value
  hotelAddress: string = "250 Kalahari Boulevard, Pocono Manor, PA 18349" // Default value
  hotelPriceAverage: string = "$" // Default value
  hotelPropertyType: string = "Hotel" // Default value
  hotelReview1: string = "The staff was very helpful and accommodating. However the hotel and pools need some loving. The rooms are cleaned, but old so there was mold growing and we could see and smell it(especially in the shower) which made my allergies, and sinuses act up. The carpeting in our room was snagged in multiple places. The pull out couch in our room just needs to go! It sagged in the middle and was not even possiable to sleep on because all you could feel was the metal under you.\nThe pools were in serious need of maintenance and updating.Also not enough towels at the pools and I wasn't there with a lot of other people there. I've stayed in many Choice hotels in the past, this hotel is NOT up to their standards.The staff however was great!" // Default value
  hotelReview2: string = "They upgraded our room to a larger suite. It was very big. But the jacuzzi tub had grime on the intake filter so we didn't use the jets. Beds were super comfy in this room but my daughter said the beds in her room were too hard. Indoor pool area was perfect for the Littles. One small slide in diar need of repair. We learned a lot for our first time and might be back again." // Default value
  hotelImages: string[] = [
    'assets/paris.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];
  location: number = 4.0; // Default value
  sleepQuality: number = 4.0; // Default value
  rooms: number = 4.0; // Default value
  service: number = 3.5; // Default value
  value: number = 3.0; // Default value
  cleanliness: number = 4.0; // Default value





}
