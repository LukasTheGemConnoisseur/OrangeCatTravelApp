import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  reviewerName: string = "Simba Karuza" // Default reviewer name
  reviewerLocation: string = "Honolulu, Hawaii" // Default reviewer location
  reviewScore: number = 5 // Default review score
  reviewTitle: string = "One of the best experiences ever!" // Default review title
  reviewDate: string = "Jun 2024" // Default review date
  reviewContent: string = "Super awesome water park. Lots of rides and the food is great too. Black anaconda was my absolute favorite ride. The twists and bends were so intense! The queue for it was the worst though. Be ready to stand in line for over an hour during busy times. Still though, 10/10 would go again." // Default review content

}
