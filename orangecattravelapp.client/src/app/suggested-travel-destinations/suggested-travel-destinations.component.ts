import { Component } from '@angular/core';

@Component({
  selector: 'app-suggested-travel-destinations',
  templateUrl: './suggested-travel-destinations.component.html',
  styleUrls: ['./suggested-travel-destinations.component.css']
})
export class SuggestedTravelDestinationsComponent {
  destinations = [
    {
      name: 'Paris',
      image: 'assets/paris.jpg',
      link: '#'
    },
    {
      name: 'New York',
      image: 'assets/newyork.jpg',
      link: '#'
    },
    {
      name: 'Tokyo',
      image: 'assets/tokyo.jpg',
      link: '#'
    },
    {
      name: 'Sydney',
      image: 'assets/sydney.jpg',
      link: '#'
    }
  ];
}
