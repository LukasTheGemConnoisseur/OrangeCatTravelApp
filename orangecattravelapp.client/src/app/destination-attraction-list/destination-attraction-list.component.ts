import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { forkJoin, from, Observable } from 'rxjs';
import { mergeMap, map, concatMap, toArray } from 'rxjs/operators';

export interface Place {
  name: string;
  image: string;
  location_id: number;
  description: string;
  rating: string;
  num_reviews: string;
  group: string;
}

@Component({
  selector: 'app-destination-attraction-list',
  templateUrl: './destination-attraction-list.component.html',
  styleUrls: ['./destination-attraction-list.component.css']
})
export class DestinationAttractionListComponent implements OnInit {
  attractions: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  destinationParam: string = '';
  searchResults: any;
  locationId: number = 0;
  destinationName: string = '';
  destinationGroup: string = '';
  lat: string = '';
  long: string = '';
  latLong: string = '';
  cityID: number = 0;
  cityResults: string = '';

  adventures: Place[] = [];

  showFilters: boolean = false;
  filters: any = {
    filter1: '',
    filter2: ''
  };

  isLoading: boolean = false;

  // Add a Set to track unique location IDs
  private existingLocationIds: Set<number> = new Set();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripAdvisorApi: TripAdvisorApiService
  ) { }

  ngOnInit(): void {
    this.destinationParam = this.route.snapshot.paramMap.get('destination') || '';

    // Read parameters passed via navigation state (See All button)
    console.log('Full history state:', history.state);
    if (history.state.destinationName) {
      this.destinationName = history.state.destinationName;
    }

    if (history.state.location_id) {
      this.locationId = history.state.location_id;
    }

    if (history.state.attractions) {
      this.attractions = history.state.attractions;
      this.attractions.forEach(attraction => {
        if (attraction.location_id) {
          this.existingLocationIds.add(attraction.location_id);
        }
      });
    }

    this.getCityDescription();
    this.loadAttractions();
  }

  /**
   * Load initial attractions with rate limiting and concurrency control
   */
  loadAttractions(): void {
    const startIndex = this.adventures.length;
    const endIndex = startIndex + this.pageSize;

    // Extract location IDs from initial attractions
    const locationIds: number[] = [];
    for (let j = startIndex; j < endIndex && j < this.attractions.length; j++) {
      if (this.attractions[j]?.location_id) {
        locationIds.push(this.attractions[j].location_id);
      }
    }

    // Add places with initial data
    for (let j = startIndex; j < endIndex && j < this.attractions.length; j++) {
      const newPlace: Place = {
        name: this.attractions[j]?.name || 'N/A',
        image: this.attractions[j]?.image || 'assets/picture_failed.png',
        location_id: this.attractions[j]?.location_id || 0,
        description: 'N/A',
        rating: 'N/A',
        num_reviews: 'N/A',
        group: 'N/A'
      };
      this.adventures.push(newPlace);
    }

    // Fetch details for all new places with concurrency limit
    if (locationIds.length > 0) {
      this.fetchAttractionsDetailsWithConcurrencyLimit(locationIds).subscribe({
        next: (detailsArray) => {
          detailsArray.forEach((details: any, index: number) => {
            if (index < this.pageSize && index < this.adventures.length) {
              this.adventures[startIndex + index].description = details.description || '';
              this.adventures[startIndex + index].rating = details.rating || 'N/A';
              this.adventures[startIndex + index].num_reviews = details.num_reviews || '';
              this.adventures[startIndex + index].group = details.groups?.[0]?.localized_name || '';
            }
          });
        },
        error: (error) => {
          console.error('Error fetching attraction details:', error);
        }
      });
    }
  }

  /**
   * Load more attractions with rate limiting and concurrency control
   */
  loadMore(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.latLong = this.LatLongCreator();
    console.log('Loading more attractions with coordinates:', this.latLong);

    this.tripAdvisorApi.searchNearbyAttractions(this.destinationName, this.latLong).subscribe({
      next: (results) => {
        if (results?.data) {
          // Filter out duplicates
          const newAttractions = results.data.filter((attraction: any) => {
            const locationId = attraction?.location_id || 0;
            if (!locationId || this.existingLocationIds.has(locationId)) {
              return false;
            }
            this.existingLocationIds.add(locationId);
            return true;
          });

          console.log(`Found ${newAttractions.length} new unique attractions`);

          // Extract location IDs for detailed fetching
          const locationIds = newAttractions
            .filter((a: any) => a.location_id)
            .map((a: any) => a.location_id);

          // Add places with initial data
          newAttractions.forEach((attraction: any) => {
            const newPlace: Place = {
              name: attraction?.name || 'N/A',
              image: attraction?.image || 'assets/picture_failed.png',
              location_id: attraction.location_id,
              description: 'N/A',
              rating: 'N/A',
              num_reviews: 'N/A',
              group: 'N/A'
            };
            this.adventures.push(newPlace);
          });

          // Fetch photos and details with concurrency limits
          if (locationIds.length > 0) {
            const photosObs = this.fetchAttractionsPhotosWithConcurrencyLimit(locationIds).pipe(
              map(photosArray => photosArray.map((photo: any) => photo?.data?.[0]?.images?.original?.url ||
                photo?.data?.[0]?.images?.large?.url ||
                'assets/picture_failed.png'))
            );

            const detailsObs = this.fetchAttractionsDetailsWithConcurrencyLimit(locationIds);

            forkJoin({
              photos: photosObs,
              details: detailsObs
            }).subscribe({
              next: (result) => {
                result.photos.forEach((photo: string, index: number) => {
                  const attractionIndex = this.adventures.length - newAttractions.length + index;
                  if (attractionIndex >= 0) {
                    this.adventures[attractionIndex].image = photo;
                  }
                });

                result.details.forEach((detail: any, index: number) => {
                  const attractionIndex = this.adventures.length - newAttractions.length + index;
                  if (attractionIndex >= 0) {
                    this.adventures[attractionIndex].description = detail.description || '';
                    this.adventures[attractionIndex].rating = detail.rating || 'N/A';
                    this.adventures[attractionIndex].num_reviews = detail.num_reviews || '';
                    this.adventures[attractionIndex].group = detail.groups?.[0]?.localized_name || '';
                  }
                });
              },
              error: (error) => {
                console.error('Error fetching attraction details and photos:', error);
              }
            });
          }
        }
      },
      error: (error) => {
        console.error('Error fetching more attractions:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Fetch multiple attraction photos with a concurrency limit of 3
   */
  private fetchAttractionsPhotosWithConcurrencyLimit(locationIds: number[]): Observable<any[]> {
    return from(locationIds).pipe(
      mergeMap(
        id => this.tripAdvisorApi.displayDestinationPhotos(id),
        3 // Process max 3 requests at a time
      ),
      toArray()
    );
  }

  /**
   * Fetch multiple attraction details with a concurrency limit of 3
   */
  private fetchAttractionsDetailsWithConcurrencyLimit(locationIds: number[]): Observable<any[]> {
    return from(locationIds).pipe(
      mergeMap(
        id => this.tripAdvisorApi.displayDestinationAttractionDetails(id),
        3 // Process max 3 requests at a time
      ),
      toArray()
    );
  }

  getCityDescription(): void {
    this.cityID = this.locationId;
    this.tripAdvisorApi.displayDestinationDescription(this.cityID).subscribe({
      next: (results) => {
        this.lat = results.latitude;
        this.long = results.longitude;
        console.log(`Lat/Long set to: ${this.lat}, ${this.long}`);
      },
      error: (error) => {
        console.error('Error fetching lat long:', error);
      }
    });
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  LatLongCreator(): string {
    const originalLat = parseFloat(this.lat);
    const originalLong = parseFloat(this.long);

    const latAdjustment = (Math.random() * 0.18 - 0.09);
    const longAdjustment = (Math.random() * 0.18 - 0.09);

    const newLat = originalLat + latAdjustment;
    const newLong = originalLong + longAdjustment;

    return `${newLat.toFixed(6)},${newLong.toFixed(6)}`;
  }

  viewAttractionDetails(attraction: Place): void {
    const slug = this.slugify(attraction.name);
    console.log('Redirecting to', slug, 'attraction details');
    this.router.navigate(['/destination-attraction-details', slug], {
      state: { attractionObject: attraction }
    });
  }

  slugify(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
}
