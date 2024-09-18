import { Component } from '@angular/core';

@Component({
  selector: 'app-destination-hotel-list',
  templateUrl: './destination-hotel-list.component.html',
  styleUrls: ['./destination-hotel-list.component.css']
})

export class DestinationHotelListComponent {
  destinationName: string = "Wisconsin Dells" // Default value
  hotelName: string = "Atlantis Family Waterpark Hotel" // Default value
  hotelRating: number = 4.0 // Default value
  hotelReviewNumber: number = 152 // Default value
  hotelPriceAverage: string = "$" // Default value
  hotelPropertyType: string = "Hotel" // Default value
  hotelReview1: string = "The staff was very helpful and accommodating. However the hotel and pools need some loving. The rooms are cleaned, but old so there was mold growing and we could see and smell it(especially in the shower) which made my allergies, and sinuses act up. The carpeting in our room was snagged in multiple places. The pull out couch in our room just needs to go! It sagged in the middle and was not even possiable to sleep on because all you could feel was the metal under you.\nThe pools were in serious need of maintenance and updating.Also not enough towels at the pools and I wasn't there with a lot of other people there. I've stayed in many Choice hotels in the past, this hotel is NOT up to their standards.The staff however was great!" // Default value
  hotelReview2: string = "They upgraded our room to a larger suite. It was very big. But the jacuzzi tub had grime on the intake filter so we didn't use the jets. Beds were super comfy in this room but my daughter said the beds in her room were too hard. Indoor pool area was perfect for the Littles. One small slide in diar need of repair. We learned a lot for our first time and might be back again." // Default value

  // Simulating hotel data for now, will be replaced by API data later
  hotels: Hotel[] = [
    {
      id: 1,
      name: 'Hotel 1',
      image: 'https://via.placeholder.com/150',
      rating: 4.5,
      reviews: 120,
      propertyType: 'Luxury',
      price: '$200',
      review1: 'Great hotel with amazing services.',
      review2: 'Will definitely come back!'
    },
    {
      id: 2,
      name: 'Hotel 2',
      image: 'https://via.placeholder.com/150',
      rating: 4.0,
      reviews: 85,
      propertyType: 'Budget',
      price: '$100',
      review1: 'Good value for money.',
      review2: 'Clean rooms but small.'
    },
    // Add more hotel objects here following the same structure
  ];

  // Define the displayedHotels array using the Hotel type
  displayedHotels: Hotel[] = [];
  hotelsToDisplay = 5; // Number of hotels to display initially

  constructor() {
    // Load the first set of hotels
    this.displayedHotels = this.hotels.slice(0, this.hotelsToDisplay);
  }

  // Method to load more hotels
  loadMoreHotels() {
    const currentLength = this.displayedHotels.length;
    const nextHotels = this.hotels.slice(currentLength, currentLength + 5);
    this.displayedHotels = [...this.displayedHotels, ...nextHotels];
  }
}

interface Hotel {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  propertyType: string;
  price: string;
  review1: string;
  review2: string;
}
