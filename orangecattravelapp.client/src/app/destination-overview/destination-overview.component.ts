import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-destination-overview',
  templateUrl: './destination-overview.component.html',
  styleUrls: ['./destination-overview.component.css']
})
export class DestinationOverviewComponent {
  destinationName: string = 'Wisconsin Dells'; // Default name
  destinationBriefOverviewAI: string = 'Nestled along the banks of the Wisconsin River, Wisconsin Dells is renowned for its stunning natural beauty and family-friendly attractions. Known as the "Waterpark Capital of the World," this vibrant city offers a mix of outdoor adventures, thrilling waterparks, and a rich history, making it a perfect getaway for all ages.'
  attractionImages: string[] = [
    'assets/sydney.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];

  adventures = [
    {
      name: 'Mount Olympus',
      image: 'assets/paris.jpg',
      link: '#'
    },
    {
      name: 'Kalahari Indoor Waterpark',
      image: 'assets/newyork.jpg',
      link: '#'
    },
    {
      name: 'Wilderness Territory',
      image: 'assets/tokyo.jpg',
      link: '#'
    },
    {
      name: 'Timbavati Wildlife Park',
      image: 'assets/sydney.jpg',
      link: '#'
    }
  ];
  hotels = [
    {
      name: 'Black Hawk Motel & Suites',
      image: 'assets/paris.jpg',
      link: '#'
    },
    {
      name: 'Ambers Inn & Suites',
      image: 'assets/newyork.jpg',
      link: '#'
    },
    {
      name: 'Cedar Lodge & Settlement',
      image: 'assets/tokyo.jpg',
      link: '#'
    },
    {
      name: 'All Star Inn & Suites',
      image: 'assets/sydney.jpg',
      link: '#'
    }
  ];
  restaurants = [
    {
      name: 'Dells Pizza Lab',
      image: 'assets/paris.jpg',
      link: '#'
    },
    {
      name: "Kaminski's Chop House",
      image: 'assets/newyork.jpg',
      link: '#'
    },
    {
      name: 'High Rock Cafe',
      image: 'assets/tokyo.jpg',
      link: '#'
    },
    {
      name: 'Hot Dog Avenue',
      image: 'assets/sydney.jpg',
      link: '#'
    }
  ];
  constructor(private router: Router) { }
  adventureSeeAll() {
    console.log('Redirecting...');
    // Add your routing functionality here
    this.router.navigate(['/destination-attraction-list']);
  }
  hotelSeeAll() {
    console.log('Redirecting...');
    // Add your routing functionality here
    this.router.navigate(['/destination-hotel-list']);


  }
  restaurantSeeAll() {
    console.log('Redirecting...');
    // Add your routing functionality here
    this.router.navigate(['/destination-restaurant-list']);
  }


}
