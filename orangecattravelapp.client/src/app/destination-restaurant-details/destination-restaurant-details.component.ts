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
  restaurantAbout: string = "In a state where Eating Meat is a religion, there’s only one place to fill up on your favorite fare: Kaminski’s Chop House, voted #1 Best Steakhouse in Wisconsin by EatThis.com in 2021 AND 2022! Treat yourself to the sublime pleasures of hand-cut, dry-aged beef, a variety of seafood delights, well-paired wines, and extraordinary service. Think that isn’t enough? Our view can top it! Request a table by the window and enjoy breathtaking views of the scenic beauty the Wisconsin River provides. Locally owned and operated for over 15 years, the Kaminski Family opened Chop House in 2006 with one goal in mind - offer the best quality product, with even better service. Join us for a dining experience that celebrates the best of the best." // Default value
  restaurantCuisines: string = "American, Steakhouse, Seafood" // Default value
  restaurantFeatures: string = "Takeout, Reservations, Private Dining, Seating, Parking Available, Highchairs Available, Wheelchair Accessible, Serves Alcohol, Full Bar, Free Wifi, Accepts Credit Cards, Table Service, Live Music, Gift Cards Available" // Default value
  restaurantImages: string[] = [
    'assets/paris.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];

  constructor() {
    this.encodedAddress = encodeURIComponent(this.address);
  }
}
