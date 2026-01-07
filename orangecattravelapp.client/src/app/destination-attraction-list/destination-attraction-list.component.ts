import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { forkJoin, from, lastValueFrom, Observable, timer, throwError } from 'rxjs';
import { mergeMap, retryWhen, concatMap, delay } from 'rxjs/operators';
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

  // Add a Set to track unique location IDs
  private existingLocationIds: Set<number> = new Set();

  constructor
    (private router: Router,
    private route: ActivatedRoute,
    private tripAdvisorApi: TripAdvisorApiService) { }

  ngOnInit(): void {

    this.destinationParam = this.route.snapshot.paramMap.get('destination') || '';

    // Read parameters passed via navigation state (See All button)
    console.log('Full history state:', history.state);
    if (history.state.destinationName) {
      this.destinationName = history.state.destinationName;
    }

    if (history.state.location_id) {
      this.locationId = history.state.location_id
    }

    if (history.state.attractions) {
      this.attractions = history.state.attractions;
      this.attractions.forEach(attraction => {
        if (attraction.location_id) {
          this.existingLocationIds.add(attraction.location_id);
        }
      });
    }

    this.loadAttractions();
    this.getCityDescription();
  }

  loadAttractions() {

    const startIndex = this.adventures.length;
    const endIndex = startIndex + this.pageSize;

    for (let j = startIndex; j < endIndex && j < this.attractions.length; j++) {
      const newPlace: Place = {
        name: this.attractions[j]?.name || 'N/A',
        image: 'assets/picture_failed.png',
        location_id: this.attractions[j]?.location_id || 0,
        description: 'N/A',
        rating: 'N/A',
        num_reviews: 'N/A',
        group: 'N/A'
      };

      if (newPlace.location_id) {
        newPlace.image = this.attractions[j]?.image || 'assets/picture_failed.png';
      }

      this.adventures.push(newPlace);

      // Fetch details for the new place
      this.tripAdvisorApi.displayDestinationAttractionDetails(newPlace.location_id).subscribe({
        next: (results) => {
          newPlace.description = results.description || '';
          newPlace.rating = results.rating || 'N/A';
          newPlace.num_reviews = results.num_reviews || '';
          newPlace.group = results.groups?.[0]?.localized_name || '';
        },
        error: (error) => {
          console.error('Error fetching attraction details:', error);
        }
      });
    }
  }

  isLoading: boolean = false;

  loadMore(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    // Get new coordinates
    this.latLong = this.LatLongCreator();
    console.log('Loading more attractions with coordinates:', this.latLong);

    // Use these coordinates to fetch new attractions
    this.tripAdvisorApi.searchNearbyAttractions(this.destinationName, this.latLong).subscribe({
      next: (results) => {
        if (results?.data) {
          // Filter out duplicates before processing
          const newAttractions = results.data.filter((attraction: any) => {
            const locationId = attraction?.location_id || 0;
            if (!locationId || this.existingLocationIds.has(locationId)) {
              return false; // Skip if no location_id or if we've seen it before
            }
            this.existingLocationIds.add(locationId); // Add to our tracking Set
            return true;
          });

          console.log(`Found ${newAttractions.length} new unique attractions`);

          // Process each unique new attraction
          newAttractions.forEach((attraction: any) => {
            const newPlace: Place = {
              name: attraction?.name || 'N/A',
              image: 'assets/picture_failed.png',
              location_id: attraction.location_id,
              description: 'N/A',
              rating: 'N/A',
              num_reviews: 'N/A',
              group: 'N/A'
            };

            // Only process if we have a valid location_id
            if (newPlace.location_id) {
              // Get photos
              this.tripAdvisorApi.displayDestinationPhotos(newPlace.location_id).subscribe({
                next: (photoData) => {
                  newPlace.image = photoData.data?.[0]?.images?.original?.url ||
                    photoData.data?.[0]?.images?.large?.url ||
                    'assets/picture_failed.png';
                  console.log(`Loaded image for ${newPlace.name}:`, newPlace.image);
                },
                error: (error) => {
                  console.error(`Error fetching photos for ${newPlace.name}:`, error);
                }
              });

              // Get details
              this.tripAdvisorApi.displayDestinationAttractionDetails(newPlace.location_id).subscribe({
                next: (details) => {
                  newPlace.description = details.description || '';
                  newPlace.rating = details.rating || 'N/A';
                  newPlace.num_reviews = details.num_reviews || '';
                  newPlace.group = details.groups?.[0]?.localized_name || '';
                  console.log(`Loaded details for ${newPlace.name}`);
                },
                error: (error) => {
                  console.error(`Error fetching details for ${newPlace.name}:`, error);
                }
              });
            }

            // Add the new place to adventures array
            this.adventures.push(newPlace);
          });
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

  getCityDescription(): void {
    this.cityID = this.locationId
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
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

  LatLongCreator(): string {
    // Convert string coordinates to numbers
    console.log(this.lat)
    const originalLat = parseFloat(this.lat);
    console.log(originalLat);
    const originalLong = parseFloat(this.long);

    // Generate random adjustments for second decimal (-0.09 to 0.09)
    const latAdjustment = (Math.random() * 0.18 - 0.09);
    console.log(latAdjustment);
    const longAdjustment = (Math.random() * 0.18 - 0.09);

    // Apply adjustments
    const newLat = originalLat + latAdjustment;
    console.log(newLat);
    const newLong = originalLong + longAdjustment;

    // Format to 6 decimal places to maintain precision
    return `${newLat.toFixed(6)},${newLong.toFixed(6)}`;
  }

  viewAttractionDetails(attraction: Place) {
    const slug = this.slugify(attraction.name);
    console.log('Redirecting to', slug, 'attraction details');
    // Routing to Attraction Details
    this.router.navigate(['/destination-attraction-details', slug], {
      state: { attractionObject: attraction}
    })
  }

  slugify(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

}


  //toggleFilters(): void {
  //  this.showFilters = !this.showFilters;
  //}

  //applyFilters(): void {
  //  // Add logic to filter attractions based on the filters
  //  console.log('Applying filters:', this.filters);
  //  this.showFilters = !this.showFilters;
  //  // Example: Filter attractions locally
  //  // this.attractions = this.attractions.filter(attraction => {
  //  //   return attraction.name.includes(this.filters.filter1) &&
  //  //          attraction.description.includes(this.filters.filter2);
  //  // });
  //}
  //resetFilters(): void {
  //  this.filters = { filter1: '', filter2: '' };
  //}
