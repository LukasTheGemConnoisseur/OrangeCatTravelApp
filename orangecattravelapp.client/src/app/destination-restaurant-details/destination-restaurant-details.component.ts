import { Component } from '@angular/core';

@Component({
  selector: 'app-destination-restaurant-details',
  templateUrl: './destination-restaurant-details.component.html',
  styleUrls: ['./destination-restaurant-details.component.css']
})
export class DestinationRestaurantDetailsComponent {
  restaurantName: string = "High Rock Cafe"; //Default Value
  restaurantRating: number = 5 // Default value
  restaurantReviewNumber: number = 1000 // Default value
  restaurantCuisine: string = "American" // Default value
  restaurantPriceAverage: string = "$$" // Default value
  restaurantReview1: string = "This restaurant had great pancakes and even better chicken strips!" // Default value
  restaurantReview2: string = "Although the wait time was over an hour, we did get some incredible filet mignon! Worth every dollar." // Default value
  phone: string = "+1 608-254-5677" // Default value
  website: string = "http://www.highrockcafe.com" // Default value
  address: string = "232 Broadway, Wisconsin Dells, WI 53965-1565" // Default value
  encodedAddress: string =""
  hours: string = "10AM - 6PM" // Default value
  restaurantOpenOrClosed: string = "Open now" // Default value
  food: string = "4.5" // Default value
  service: string = "4.5" // Default value
  value: string = "4.0" // Default value
  atmosphere: string = "5" // Default value
  restaurantImages: string[] = [
    'assets/paris.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];

  constructor() {
    this.encodedAddress = encodeURIComponent(this.address);
  }
}
