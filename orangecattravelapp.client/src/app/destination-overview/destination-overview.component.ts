import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { forkJoin, from, Observable } from 'rxjs';
import { mergeMap, map, toArray } from 'rxjs/operators';

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

  /**
   * Load description and nearby places with rate limiting and concurrency control
   */
  loadDescription(): void {
    this.tripAdvisorApi.displayDestinationDescription(this.locationId).pipe(
      mergeMap(results => {
        this.destinationBriefOverview = results.description;
        this.lat = results.latitude;
        this.long = results.longitude;
        this.latLong = this.lat + ',' + this.long;

        // Load all nearby places in parallel
        return forkJoin({
          attractions: this.tripAdvisorApi.displayDestinationAttractions(this.destinationName, 'attractions'),
          hotels: this.tripAdvisorApi.displayDestinationAttractions(this.destinationName, 'hotels'),
          restaurants: this.tripAdvisorApi.displayDestinationAttractions(this.destinationName, 'restaurants')
        });
      }),
      mergeMap(results => {
        // Extract location IDs for photo fetching with concurrency limit
        const adventureIds = results.attractions.data?.slice(0, 9).map((a: any) => Number(a.location_id)) || [];
        const hotelIds = results.hotels.data?.slice(0, 9).map((h: any) => Number(h.location_id)) || [];
        const restaurantIds = results.restaurants.data?.slice(0, 9).map((r: any) => Number(r.location_id)) || [];

        const allLocationIds = [...adventureIds, ...hotelIds, ...restaurantIds];

        // Fetch all photos with concurrency limit
        const photosObs = this.fetchPhotosWithConcurrencyLimit(allLocationIds).pipe(
          map(photosArray => ({
            adventurePhotos: photosArray.slice(0, adventureIds.length),
            hotelPhotos: photosArray.slice(adventureIds.length, adventureIds.length + hotelIds.length),
            restaurantPhotos: photosArray.slice(adventureIds.length + hotelIds.length)
          }))
        );

        return forkJoin({
          attractions: from([results.attractions]),
          hotels: from([results.hotels]),
          restaurants: from([results.restaurants]),
          photos: photosObs
        });
      })
    ).subscribe({
      next: (results: any) => {
        this.processPlacesData(
          results.attractions.data,
          results.hotels.data,
          results.restaurants.data,
          results.photos
        );
      },
      error: (error) => {
        console.error('Error fetching destination data:', error);
      }
    });
  }

  /**
   * Fetch destination photos
   */
  loadDestinationPhotos(): void {
    this.tripAdvisorApi.displayDestinationPhotos(this.locationId).subscribe({
      next: (results) => {
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

  /**
   * Process places data and populate arrays
   */
  private processPlacesData(
    attractionsData: any[],
    hotelsData: any[],
    restaurantsData: any[],
    photosData: any
  ): void {
    // Update adventures (attractions)
    for (let j = 0; j < 9; j++) {
      this.adventures[j].name = attractionsData?.[j]?.name || 'N/A';
      this.adventures[j].location_id = attractionsData?.[j]?.location_id || 0;
      if (j < photosData.adventurePhotos.length && photosData.adventurePhotos[j]) {
        this.adventures[j].image = photosData.adventurePhotos[j].data?.[0]?.images?.original?.url ||
          photosData.adventurePhotos[j].data?.[0]?.images?.large?.url ||
          'assets/picture_failed.png';
      }
    }

    // Update hotels
    for (let j = 0; j < 9; j++) {
      this.hotels[j].name = hotelsData?.[j]?.name || 'N/A';
      this.hotels[j].location_id = hotelsData?.[j]?.location_id || 0;
      if (j < photosData.hotelPhotos.length && photosData.hotelPhotos[j]) {
        this.hotels[j].image = photosData.hotelPhotos[j].data?.[0]?.images?.original?.url ||
          photosData.hotelPhotos[j].data?.[0]?.images?.large?.url ||
          'assets/picture_failed.png';
      }
    }

    // Update restaurants
    for (let j = 0; j < 9; j++) {
      this.restaurants[j].name = restaurantsData?.[j]?.name || 'N/A';
      this.restaurants[j].location_id = restaurantsData?.[j]?.location_id || 0;
      if (j < photosData.restaurantPhotos.length && photosData.restaurantPhotos[j]) {
        this.restaurants[j].image = photosData.restaurantPhotos[j].data?.[0]?.images?.original?.url ||
          photosData.restaurantPhotos[j].data?.[0]?.images?.large?.url ||
          'assets/picture_failed.png';
      }
    }
  }

  /**
   * Fetch multiple photos with a concurrency limit of 3
   */
  private fetchPhotosWithConcurrencyLimit(locationIds: number[]): Observable<any[]> {
    return from(locationIds).pipe(
      mergeMap(
        id => this.tripAdvisorApi.displayDestinationPhotos(id),
        3 // Process max 3 requests at a time
      ),
      toArray()
    );
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
