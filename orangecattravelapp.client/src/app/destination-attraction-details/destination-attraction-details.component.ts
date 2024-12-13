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
    'assets/paris.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];
  constructor() {
    this.encodedAddress = encodeURIComponent(this.attractionAddress);
  }

  ngOnInit(): void {

  }
}
