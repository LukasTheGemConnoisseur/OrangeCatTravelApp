import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { forkJoin, from, lastValueFrom, Observable, timer, throwError } from 'rxjs';
import { mergeMap, retryWhen, concatMap, delay } from 'rxjs/operators';

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
    { name: 'N/A', image: 'assets/picture_failed.png', link: '#', location_id: 0 },
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

  private createRetryStrategy() {
    return (attempts: Observable<any>) =>
      attempts.pipe(
        concatMap((error, index) => {
          const retryAttempt = index + 1;
          if (retryAttempt > 3 || error.status !== 429) {
            return throwError(() => error);
          }
          const delayMs = retryAttempt * 250;
          console.log(`Retrying request after ${delayMs}ms`);
          return timer(delayMs);
        })
      );
  }

  private async fetchWithRetry(observable: Observable<any>): Promise<any> {
    return lastValueFrom(observable.pipe(
      retryWhen(this.createRetryStrategy())
    ));
  }

  async loadDestinationPhotos() {
    try {
      const results = await this.fetchWithRetry(
        this.tripAdvisorApi.displayDestinationPhotos(this.locationId)
      );

      for (let index = 0; index < 5; index++) {
        const photo = results.data?.[index]?.images?.original?.url;
        const photo_backup = results.data?.[index]?.images?.large?.url;
        this.attractionImages.push(photo || photo_backup || 'assets/picture_failed.png');
      }
    } catch (error) {
      console.error('Error fetching destination photos:', error);
    }
  }

  async loadDescription() {
    try {
      const results = await this.fetchWithRetry(
        this.tripAdvisorApi.displayDestinationDescription(this.locationId)
      );

      this.destinationBriefOverview = results.description;
      this.lat = results.latitude;
      this.long = results.longitude;

      await this.loadNearbyPlaces();
    } catch (error) {
      console.error('Error fetching destination description:', error);
    }
  }

  async loadNearbyPlaces() {
    this.latLong = this.lat + ',' + this.long;

    try {
      // Load nearby places sequentially instead of in parallel
      for (let i = 0; i < this.nearbyPlaces.length; i++) {
        const placeType = this.nearbyPlaces[i];
        await new Promise(resolve => setTimeout(resolve, 250)); // Add delay between requests

        const response = await this.fetchWithRetry(
          this.tripAdvisorApi.displayDestinationAttractions(this.destinationName, placeType)
        );
        this.nearby[i] = response;
      }

      // Process the results
      for (let j = 0; j < 9; j++) {
        this.adventures[j].name = this.nearby[0]?.data?.[j]?.name || 'N/A';
        this.hotels[j].name = this.nearby[1]?.data?.[j]?.name || 'N/A';
        this.restaurants[j].name = this.nearby[2]?.data?.[j]?.name || 'N/A';

        this.adventures[j].location_id = this.nearby[0]?.data?.[j]?.location_id || 0;
        this.hotels[j].location_id = this.nearby[1]?.data?.[j]?.location_id || 0;
        this.restaurants[j].location_id = this.nearby[2]?.data?.[j]?.location_id || 0;
      }

      // Load photos sequentially
      for (let k = 0; k < 9; k++) {
        await new Promise(resolve => setTimeout(resolve, 250)); // Add delay between requests

        if (this.adventures[k].location_id) {
          try {
            const photoData = await this.fetchWithRetry(
              this.tripAdvisorApi.displayDestinationPhotos(this.adventures[k].location_id)
            );
            this.adventures[k].image = photoData.data?.[0]?.images?.original?.url ||
              photoData.data?.[0]?.images?.large?.url ||
              'assets/picture_failed.png';
          } catch (error) {
            console.error(`Error fetching photo for adventure ${k}:`, error);
          }
        }

        if (this.hotels[k].location_id) {
          try {
            const photoData = await this.fetchWithRetry(
              this.tripAdvisorApi.displayDestinationPhotos(this.hotels[k].location_id)
            );
            this.hotels[k].image = photoData.data?.[0]?.images?.original?.url ||
              photoData.data?.[0]?.images?.large?.url ||
              'assets/picture_failed.png';
          } catch (error) {
            console.error(`Error fetching photo for hotel ${k}:`, error);
          }
        }

        if (this.restaurants[k].location_id) {
          try {
            const photoData = await this.fetchWithRetry(
              this.tripAdvisorApi.displayDestinationPhotos(this.restaurants[k].location_id)
            );
            this.restaurants[k].image = photoData.data?.[0]?.images?.original?.url ||
              photoData.data?.[0]?.images?.large?.url ||
              'assets/picture_failed.png';
          } catch (error) {
            console.error(`Error fetching photo for restaurant ${k}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error in loadNearbyPlaces:", error);
    }
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
    const slug = this.slugify(this.destinationName);
    console.log('Redirecting to', slug, 'attraction list');
    // routing functionality
    this.router.navigate(['/destination-attraction-list', slug], {
      state: { destinationName: this.destinationName, attractions: this.adventures, location_id: this.locationId }
    });
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
