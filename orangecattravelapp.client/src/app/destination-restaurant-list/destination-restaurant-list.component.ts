import { Component } from '@angular/core';

@Component({
  selector: 'app-destination-restaurant-list',
  templateUrl: './destination-restaurant-list.component.html',
  styleUrls: ['./destination-restaurant-list.component.css']
})
export class DestinationRestaurantListComponent {
  destinationName: string = "Wisconsin Dells" // Default value
  restaurantName: string = "Dells Pizza Lab" // Default value
  restaurantRating: number = 5 // Default value
  restaurantReviewNumber: number = 1000 // Default value
  restaurantCuisine: string = "American" // Default value
  restaurantPriceAverage: string = "$$" // Default value
  restaurantReview1: string = "This restaurant had great pancakes and even better chicken strips!" // Default value
  restaurantReview2: string = "Although the wait time was over an hour, we did get some incredible filet mignon! Worth every dollar." // Default value
}
