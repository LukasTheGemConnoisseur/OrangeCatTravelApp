import { Component } from '@angular/core';

@Component({
  selector: 'app-destination-attraction-details',
  templateUrl: './destination-attraction-details.component.html',
  styleUrls: ['./destination-attraction-details.component.css']
})
export class DestinationAttractionDetailsComponent {
  attractionName: string = "Noah's Ark Water Park"; // Default name
  businessHoursOpening: string = "10:00 AM"; // Default opening hours
  businessHoursClosing: string = "5:00 PM"; // Default closing hours
  attractionWebsite: string = "https://www.noahsarkwaterpark.com/" // Default website
  attractionAddress: string = "1410 Wisconsin Dells Pkwy, Wisconsin Dells, WI 53965-8445"; // Default address
  attractionImages: string[] = [
    'assets/paris.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];
  constructor() { }

  ngOnInit(): void {
  }
}
