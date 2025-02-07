import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';

@Component({
  selector: 'app-destination-overview',
  templateUrl: './destination-overview.component.html',
  styleUrls: ['./destination-overview.component.css']
})
export class DestinationOverviewComponent implements OnInit {

  destinationName: string = '';
  destinationParam: string = '';
  searchResults: any;
  locationId: number = 0;
  destinationBriefOverview: string = "Location description is either missing or didn't load properly. Please try again later."
  lat: string = '';
  long: string = '';
  latLong: string = '';
  nearbyPlaces: string[] = ["attractions", "hotels", "restaurants"];
  nearby: any[] = [];

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

  constructor
    (private router: Router,
    private route: ActivatedRoute,
    private tripAdvisorApi: TripAdvisorApiService
  ) { }

  ngOnInit() {
    this.destinationParam = this.route.snapshot.paramMap.get('destination') || '';

    if (history.state.searchResults) {
      this.searchResults = history.state.searchResults;
    }
    console.log('Search results:', this.searchResults);
    this.locationId = this.searchResults.data?.[0]?.location_id;
    console.log('location Id:', this.locationId);
    this.displayData();
  }

  displayData() {
    this.destinationName = this.searchResults.data?.[0]?.name;
    this.loadDescription();
  }

  loadDescription() {
    this.tripAdvisorApi.displayDestinationDescription(this.locationId).subscribe(
      (results) => {
        console.log('Search results:', results);
        this.destinationBriefOverview = results.description;
        this.lat = results.latitude;
        this.long = results.longitude;

        this.loadNearbyPlaces();
      },
      (error) => {
        console.error('Error fetching destination description:', error);
      }
    )
  }

  loadNearbyPlaces() {
    this.latLong = this.lat + ',' + this.long;
    console.log("Latitude + longitude:", this.latLong)
    for (let i = 0; i < 3; i++) {
      this.tripAdvisorApi.displayDestinationAttractions(this.latLong, this.nearbyPlaces[i]).subscribe(
        (results) => {
          console.log(`nearby ${this.nearbyPlaces[i]}:`, results);
          this.nearby[i] = results;
        },
        (error) => {
          console.error(`Error fetching nearby ${this.nearbyPlaces[i]}:`, error);
        }
      )
    }
    console.log("nearby array:", this.nearby);

    //for (let j = 0; j < 5; j++) {
    //  this.adventures[j].name = this.nearby[0].data[j].name;
    //  console.log("adventures name:", this.adventures[j].name)
    //  this.hotels[j].name = this.nearby[1].data[j].name;
    //  this.restaurants[j].name = this.nearby[2].data[j].name;
    //}
  }


  attractionImages: string[] = [
    'assets/sydney.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];

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
