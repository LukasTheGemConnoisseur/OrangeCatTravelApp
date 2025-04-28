import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { forkJoin, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface Place {
  name: string;
  image: string;
  link: string;
  location_id: number;
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
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0},
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 }
  ];

  hotels: Place[] = [
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 }
  ];
  restaurants: Place[] = [
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 }
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
      console.log('Search results:', this.searchResults);
    } else {
      console.error('No search results found in state.');
    }
    this.locationId = this.searchResults.data?.[0]?.location_id || this.searchResults?.location_id;
    console.log('location Id:', this.locationId);
    this.displayData();
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  displayData() {
    const locationData = this.searchResults.data?.[0] || this.searchResults;
    this.locationId = locationData.location_id;
    this.destinationName = this.searchResults.data?.[0]?.name || locationData.name;


    this.loadDescription();
    this.loadDestinationPhotos();
  }

  loadDestinationPhotos() {
    this.tripAdvisorApi.displayDestinationPhotos(this.locationId).subscribe({
      next: (results) => {
        /*console.log('destination photo results:', results);*/
        for (let index = 0; index < 5; index++) {
          const photo = results.data?.[index]?.images?.original?.url;
          const photo_backup = results.data?.[index]?.images?.large?.url;
          this.attractionImages.push(photo || photo_backup || 'assets/picture_failed.png');
        }
      },
      error: (error) => {
        console.error('Error fetching destination photos:', error);
      }
    });
  }

  loadDescription() {
    this.tripAdvisorApi.displayDestinationDescription(this.locationId).subscribe({
      next: (results) => {
        this.destinationBriefOverview = results.description;
        this.lat = results.latitude;
        this.long = results.longitude;

        this.loadNearbyPlaces();
      },
      error: (error) => {
        console.error('Error fetching destination description:', error);
      }
    });
  }

  loadNearbyPlaces() {
    this.latLong = this.lat + ',' + this.long;
    console.log("Latitude + longitude:", this.latLong)

    const apiCalls = this.nearbyPlaces.map((placeType) =>
      this.tripAdvisorApi.displayDestinationAttractions(this.latLong, placeType)
    );

    forkJoin(apiCalls).subscribe({
      next: (responses) => {
        this.nearby = responses;
        console.log("nearby array:", this.nearby);

        const photoApiCalls = [];

        for (let j = 0; j < 9; j++) {
          /*assigning nearby location names to our arrays for easy access*/
          this.adventures[j].name = this.nearby[0]?.data?.[j]?.name || 'N/A';
          this.hotels[j].name = this.nearby[1]?.data?.[j]?.name || 'N/A';
          this.restaurants[j].name = this.nearby[2]?.data?.[j]?.name || 'N/A';

          /*assigning nearby location location_ids to our arrays for easy access*/
          this.adventures[j].location_id = this.nearby[0]?.data?.[j]?.location_id || 0;
          this.hotels[j].location_id = this.nearby[1]?.data?.[j]?.location_id || 0;
          this.restaurants[j].location_id = this.nearby[2]?.data?.[j]?.location_id || 0;

          /* Only push API calls if location_id is valid */
          if (this.adventures[j].location_id) {
            photoApiCalls.push(this.tripAdvisorApi.displayDestinationPhotos(this.adventures[j].location_id));
          }
          if (this.hotels[j].location_id) {
            photoApiCalls.push(this.tripAdvisorApi.displayDestinationPhotos(this.hotels[j].location_id));
          }
          if (this.restaurants[j].location_id) {
            photoApiCalls.push(this.tripAdvisorApi.displayDestinationPhotos(this.restaurants[j].location_id));
          }
        }

        forkJoin(photoApiCalls).subscribe({
          next: (photos) => {
            for (let k = 0; k < 9; k++) {
              if (this.adventures[k].location_id) {
                this.adventures[k].image = photos[0].data?.[k]?.images?.original?.url ||
                  photos[0].data?.[k]?.images?.large?.url ||
                  'assets/picture_failed.png';
              }
              if (this.hotels[k].location_id) {
                this.hotels[k].image = photos[1].data?.[k]?.images?.original?.url ||
                  photos[1].data?.[k]?.images?.large?.url ||
                  'assets/picture_failed.png';
              }
              if (this.restaurants[k].location_id) {
                this.restaurants[k].image = photos[2].data?.[k]?.images?.original?.url ||
                  photos[2].data?.[k]?.images?.large?.url ||
                  'assets/picture_failed.png';
              }
            }

            console.log("adventures name:", this.adventures);
            console.log("hotels name:", this.hotels);
            console.log("restaurants name:", this.restaurants);

          },
          error: (error) => {
            console.error("Error fetching nearby place photos:", error);
          }
          });
      },
      error: (error) => {
        console.error("Error fetching nearby places:", error);
      }
    });
  }

  slugify(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  navigateToRestaurantDetails(restaurant: any): void {
    const slug = this.slugify(restaurant.name);
    console.log('Redirecting to', slug);
    this.router.navigate(['/destination-restaurant-details', slug], {
      state: { restaurant }
    });
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
