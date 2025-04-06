import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { forkJoin } from 'rxjs';
export interface Place {
  name: string;
  image: string;
  link: string;
}

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

  adventures: Place[] = [
    { name: 'Mount Olympus', image: 'assets/paris.jpg', link: '#' },
    { name: 'Kalahari Indoor Waterpark', image: 'assets/newyork.jpg', link: '#' },
    { name: 'Wilderness Territory', image: 'assets/tokyo.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' }
  ];

  hotels: Place[] = [
    { name: 'Mount Olympus', image: 'assets/paris.jpg', link: '#' },
    { name: 'Kalahari Indoor Waterpark', image: 'assets/newyork.jpg', link: '#' },
    { name: 'Wilderness Territory', image: 'assets/tokyo.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' }
  ];

  restaurants: Place[] = [
    { name: 'Mount Olympus', image: 'assets/paris.jpg', link: '#' },
    { name: 'Kalahari Indoor Waterpark', image: 'assets/newyork.jpg', link: '#' },
    { name: 'Wilderness Territory', image: 'assets/tokyo.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' },
    { name: 'Timbavati Wildlife Park', image: 'assets/sydney.jpg', link: '#' }
  ];

  attractionImages: string[] = [];

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

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  displayData() {
    const locationData = this.searchResults.data?.[0];
    this.locationId = locationData.location_id;
    this.destinationName = this.searchResults.data?.[0]?.name;


    this.loadDescription();
    this.loadDestinationPhotos();
  }

  loadDestinationPhotos() {
    this.tripAdvisorApi.displayDestinationPhotos(this.locationId).subscribe(
      (results) => {
        console.log('destination photo results:', results);
        for (let index = 0; index < 5; index++) {
          this.attractionImages.push(results.data[index].images.original.url || 'assets/tokyo.jpg')
        }

      },
      (error) => {
        console.error('Error fetching destination photos:', error);
      }
    )
  }

  loadDescription() {
    this.tripAdvisorApi.displayDestinationDescription(this.locationId).subscribe(
      (results) => {
        /*console.log('Search results:', results);*/
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
    /*console.log("Latitude + longitude:", this.latLong)*/

    const apiCalls = this.nearbyPlaces.map((placeType) =>
      this.tripAdvisorApi.displayDestinationAttractions(this.latLong, placeType)
     /* this.tripAdvisorApi.displaySuggestedDestinationsPhotos()*/
    );

    forkJoin(apiCalls).subscribe(
      (responses) => {
        // Store responses in `this.nearby array
        this.nearby = responses;
        console.log("nearby array:", this.nearby);

        // Now that all data is available, process the arrays
        for (let j = 0; j < 9; j++) {
          this.adventures[j].name = this.nearby[0]?.data?.[j]?.name || 'N/A';
          this.hotels[j].name = this.nearby[1]?.data?.[j]?.name || 'N/A';
          this.restaurants[j].name = this.nearby[2]?.data?.[j]?.name || 'N/A';
        }
        console.log("adventures name:", this.adventures);
        console.log("hotels name:", this.hotels);
        console.log("restaurants name:", this.restaurants);
      },
      (error) => {
        console.error("Error fetching nearby places:", error);
      }
    );
  }

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
