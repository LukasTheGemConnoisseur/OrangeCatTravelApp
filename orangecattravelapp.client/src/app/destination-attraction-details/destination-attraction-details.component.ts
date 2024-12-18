import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-destination-attraction-details',
  templateUrl: './destination-attraction-details.component.html',
  styleUrls: ['./destination-attraction-details.component.css']
})
export class DestinationAttractionDetailsComponent implements OnInit {
  attractionName: string = "Noah's Ark Water Park"; // Default name
  attractionSubCategory: string = "Water & Amusement Park"; // Default sub category
  businessHoursOpening: string = "10:00 AM"; // Default opening hours
  businessHoursClosing: string = "5:00 PM"; // Default closing hours
  attractionWebsite: string = "https://www.noahsarkwaterpark.com/" // Default website
  attractionAddress: string = "1410 Wisconsin Dells Pkwy, Wisconsin Dells, WI 53965-8445"; // Default address
  attractionPhone: string = "+1 800-222-6624"; // Default phone number
  encodedAddress: string = ""
  attractionRating: number = 4.0 // Default value
  attractionReviewNumber: number = 152 // Default value
  attractionImages: string[] = [
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];
  attractionLocationImage: string = 'https://via.placeholder.com/150';

  // Define the displayedRestaurants array using the Restaurants type
  displayedRestaurants: Restaurants[] = [];
  restaurantsToDisplay = 5; // Number of restaurants to display initially
  displayedHotels: Hotels[] = [];
  hotelsToDisplay = 5; // Number of restaurants to display initially

  nearbyRestaurants: Restaurants[] = [
    {
      nearbyRestaurantId: 1,
      nearbyRestaurantName: "High Rock Cafe",
      nearbyRestaurantRating: 4.7,
      nearbyRestaurantReviewCount: 955,
      nearbyRestaurantDistance: 0.16,
      nearbyRestaurantPriceRange: "$ - $$$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 2,
      nearbyRestaurantName: "Low Rock Cafe",
      nearbyRestaurantRating: 4.2,
      nearbyRestaurantReviewCount: 95,
      nearbyRestaurantDistance: 0.19,
      nearbyRestaurantPriceRange: "$ - $$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 3,
      nearbyRestaurantName: "Plateau Rock Cafe",
      nearbyRestaurantRating: 4.0,
      nearbyRestaurantReviewCount: 855,
      nearbyRestaurantDistance: 0.35,
      nearbyRestaurantPriceRange: "$$$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 4,
      nearbyRestaurantName: "High Rock Cafe",
      nearbyRestaurantRating: 4.7,
      nearbyRestaurantReviewCount: 955,
      nearbyRestaurantDistance: 0.16,
      nearbyRestaurantPriceRange: "$ - $$$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 5,
      nearbyRestaurantName: "High Rock Cafe",
      nearbyRestaurantRating: 4.7,
      nearbyRestaurantReviewCount: 955,
      nearbyRestaurantDistance: 0.16,
      nearbyRestaurantPriceRange: "$ - $$$",
      nearbyRestaurantFoodType: "American"
    },
  ];

  nearbyHotels: Hotels[] = [
    {
      nearbyHotelId: 1,
      nearbyHotelName: "Hobit's Inn",
      nearbyHotelRating: 4.7,
      nearbyHotelReviewCount: 955,
      nearbyHotelDistance: 0.16,
      nearbyHotelType: "Luxury Resort"
    },
    {
      nearbyHotelId: 2,
      nearbyHotelName: "Holiday Suites",
      nearbyHotelRating: 4.2,
      nearbyHotelReviewCount: 155,
      nearbyHotelDistance: 0.32,
      nearbyHotelType: "Mid Hotel"
    },
    {
      nearbyHotelId: 3,
      nearbyHotelName: "Cat Den",
      nearbyHotelRating: 5.0,
      nearbyHotelReviewCount: 1955,
      nearbyHotelDistance: 0.11,
      nearbyHotelType: "Tropical Resort"
    },
    {
      nearbyHotelId: 4,
      nearbyHotelName: "Incognito Pyramid",
      nearbyHotelRating: 3.7,
      nearbyHotelReviewCount: 7455,
      nearbyHotelDistance: 0.36,
      nearbyHotelType: "High end hotel"
    },
    {
      nearbyHotelId: 5,
      nearbyHotelName: "Roadside Motel",
      nearbyHotelRating: 2.7,
      nearbyHotelReviewCount: 455,
      nearbyHotelDistance: 0.08,
      nearbyHotelType: "Motel"
    },
  ];

  ngOnInit(): void { }

  constructor() {
    this.encodedAddress = encodeURIComponent(this.attractionAddress);
    this.displayedRestaurants = this.nearbyRestaurants.slice(0, this.restaurantsToDisplay);
    this.displayedHotels = this.nearbyHotels.slice(0, this.hotelsToDisplay);
  }

}

interface Restaurants {
  nearbyRestaurantId: number;
  nearbyRestaurantName: string;
  nearbyRestaurantRating: number;
  nearbyRestaurantReviewCount: number;
  nearbyRestaurantDistance: number;
  nearbyRestaurantPriceRange: string;
  nearbyRestaurantFoodType: string;
}

interface Hotels {
  nearbyHotelId: number;
  nearbyHotelName: string;
  nearbyHotelRating: number;
  nearbyHotelReviewCount: number;
  nearbyHotelDistance: number;
  nearbyHotelType: string;
}
