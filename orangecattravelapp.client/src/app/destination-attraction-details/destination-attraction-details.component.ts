import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { GoogleMapsService, MapMarker } from '../services/google-maps.service';
import { forkJoin, from, Observable } from 'rxjs';
import { mergeMap, map, concatMap, toArray } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { MapMapModalComponent } from '../map-modal/map-modal.component';

interface Restaurants {
  nearbyRestaurantId: number;
  nearbyRestaurantLatitude: string;
  nearbyRestaurantLongitude: string;
  nearbyRestaurantLatLong: string;
  nearbyRestaurantName: string;
  nearbyRestaurantRating: number;
  nearbyRestaurantReviewCount: number;
  nearbyRestaurantDistance: number;
  nearbyRestaurantPriceRange: string;
  nearbyRestaurantFoodType: string;
}

interface Hotels {
  nearbyHotelId: number;
  nearbyHotelLatitude: string;
  nearbyHotelLongitude: string;
  nearbyHotelLatLong: string;
  nearbyHotelName: string;
  nearbyHotelRating: number;
  nearbyHotelReviewCount: number;
  nearbyHotelDistance: number;
  nearbyHotelType: string;
}

@Component({
  selector: 'app-destination-attraction-details',
  templateUrl: './destination-attraction-details.component.html',
  styleUrls: ['./destination-attraction-details.component.css']
})
export class DestinationAttractionDetailsComponent implements OnInit {
  @ViewChild(MapMapModalComponent) mapModal!: MapMapModalComponent;

  attractionLocationID: number = 0;
  attractionName: string = "";
  attractionSubCategory: string = "";
  businessHoursOpening: string = "10:00 AM";
  businessHoursClosing: string = "5:00 PM";
  businessHours: string = ""
  attractionWebsite: string = ""
  attractionAddress: string = "";
  attractionPhone: string = "";
  encodedAddress: string = ""
  attractionRating: number = 4.0
  attractionReviewNumber: number = 152
  attractionImages: string[] = [];
  attractionLocationImage: string = 'https://via.placeholder.com/150';
  attractionDescription: string = ''
  attractionParam: string = '';
  lat: string = '';
  long: string = '';
  latLong: string = '';

  // Map-related properties
  mapMarkers: MapMarker[] = [];

  displayedRestaurants: Restaurants[] = [];
  restaurantsToDisplay = 10;
  displayedHotels: Hotels[] = [];
  hotelsToDisplay = 10;

  private nearbyRestaurants: Restaurants[] = [];
  private nearbyHotels: Hotels[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private tripAdvisorApi: TripAdvisorApiService,
    private googleMapsService: GoogleMapsService) {
  }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    if (history.state.attractionObject) {
      const passedAttractionData = history.state.attractionObject;
      this.attractionName = passedAttractionData.name;
      this.attractionLocationID = passedAttractionData.location_id;
      this.attractionSubCategory = passedAttractionData.group;
      this.attractionRating = passedAttractionData.rating;
      this.attractionReviewNumber = passedAttractionData.num_reviews;
      this.attractionDescription = passedAttractionData.description;
    }

    this.getAttractionDetails();
    this.getAttractionPhotos();
  }

  /**
   * Open the map modal
   */
  openMapModal(): void {
    console.log('Opening map modal...');
    console.log('Map Modal Reference:', this.mapModal);
    console.log('Markers:', this.mapMarkers);
    this.mapModal.openModal();
  }

  /**
   * Handle marker click events
   */
  onMarkerClicked(marker: MapMarker): void {
    console.log('Marker clicked:', marker);
    // Any additional logic for marker clicks can be added here, such as showing an info window or navigating to a details page
  }

  /**
   * Fetch all details with rate limiting to avoid 429 errors
   */
  getAttractionDetails(): void {
    this.tripAdvisorApi.displayDestinationDescription(this.attractionLocationID).pipe(
      mergeMap(detailsResults => {
        console.log(detailsResults);
        this.businessHours = detailsResults?.hours?.weekday_text[this.workDay()] || "Hours Not Listed";
        this.attractionAddress = detailsResults.address_obj.address_string;
        this.encodedAddress = encodeURIComponent(this.attractionAddress);
        this.attractionDescription = detailsResults.description;
        this.attractionWebsite = detailsResults.website;
        this.attractionPhone = detailsResults.phone;
        this.lat = detailsResults.latitude;
        this.long = detailsResults.longitude;
        this.latLong = this.lat + ',' + this.long;

        // Fetch restaurants and hotels in parallel
        return forkJoin({
          restaurants: this.tripAdvisorApi.searchNearbyQuery(this.latLong, "restaurants"),
          hotels: this.tripAdvisorApi.searchNearbyQuery(this.latLong, "hotels")
        });
      }),
      mergeMap(results => {
        // Fetch restaurant and hotel details with concurrency limit
        const restaurantDetailsObs = this.fetchDetailsWithConcurrencyLimit(
          results.restaurants.data.map((r: any) => Number(r.location_id))
        ).pipe(
          map(detailsArray => detailsArray.map((details: any, index: number) => ({
            ...results.restaurants.data[index],
            details
          })))
        );

        const hotelDetailsObs = this.fetchDetailsWithConcurrencyLimit(
          results.hotels.data.map((h: any) => Number(h.location_id))
        ).pipe(
          map(detailsArray => detailsArray.map((details: any, index: number) => ({
            ...results.hotels.data[index],
            details
          })))
        );

        return forkJoin({
          restaurantsWithDetails: restaurantDetailsObs,
          hotelsWithDetails: hotelDetailsObs,
          restaurants: from([results.restaurants]),
          hotels: from([results.hotels])
        });
      })
    ).subscribe({
      next: (results: any) => {
        this.processRestaurantsData(results.restaurants.data, results.restaurantsWithDetails);
        this.processHotelsData(results.hotels.data, results.hotelsWithDetails);
        this.buildMapMarkers();
      },
      error: (error) => {
        console.error('Error fetching attraction details:', error);
      }
    });
  }

  /**
   * Build map markers from restaurants and hotels data
   */
  private buildMapMarkers(): void {
    this.mapMarkers = [];

    // Add restaurant markers
    this.nearbyRestaurants.forEach(restaurant => {
      this.mapMarkers.push(this.googleMapsService.createRestaurantMarker(restaurant));
    });

    // Add hotel markers
    this.nearbyHotels.forEach(hotel => {
      this.mapMarkers.push(this.googleMapsService.createHotelMarker(hotel));
    });
  }

  /**
   * Fetch multiple location details with a concurrency limit of 2
   */
  private fetchDetailsWithConcurrencyLimit(locationIds: number[]): Observable<any[]> {
    return from(locationIds).pipe(
      mergeMap(
        id => this.tripAdvisorApi.displayDestinationDescription(id),
        2 // Process max 2 requests at a time
      ),
      toArray()
    );
  }

  /**
   * Process restaurant data with details
   */
  private processRestaurantsData(basicData: any[], detailsData: any[]): void {
    const restaurants: Restaurants[] = basicData.map((restaurant: any, index: number) => {
      const details = detailsData[index]?.details || detailsData[index] || {};
      const distanceInt: number = Number(restaurant.distance);
      const distanceRounded: number = this.nearbyTrunc(distanceInt, 2);

      return {
        nearbyRestaurantId: Number(restaurant.location_id),
        nearbyRestaurantLatitude: details.latitude || "",
        nearbyRestaurantLongitude: details.longitude || "",
        nearbyRestaurantLatLong: `${details.latitude},${details.longitude}`,
        nearbyRestaurantName: restaurant.name,
        nearbyRestaurantRating: details.rating || 0,
        nearbyRestaurantReviewCount: details.num_reviews || 0,
        nearbyRestaurantDistance: distanceRounded,
        nearbyRestaurantPriceRange: details.price_level || "N/A",
        nearbyRestaurantFoodType: this.extractCuisine(details.cuisine) || "Various"
      };
    });

    this.nearbyRestaurants = restaurants;
    this.updateDisplayedRestaurants(Math.min(this.restaurantsToDisplay, restaurants.length));
  }

  /**
   * Process hotel data with details
   */
  private processHotelsData(basicData: any[], detailsData: any[]): void {
    const hotels: Hotels[] = basicData.map((hotel: any, index: number) => {
      const details = detailsData[index]?.details || detailsData[index] || {};
      const distanceInt: number = Number(hotel.distance);
      const distanceRounded: number = this.nearbyTrunc(distanceInt, 2);

      return {
        nearbyHotelId: Number(hotel.location_id),
        nearbyHotelLatitude: details.latitude || "",
        nearbyHotelLongitude: details.longitude || "",
        nearbyHotelLatLong: `${details.latitude},${details.longitude}`,
        nearbyHotelName: hotel.name,
        nearbyHotelRating: details.rating || 0,
        nearbyHotelReviewCount: details.num_reviews || 0,
        nearbyHotelDistance: distanceRounded,
        nearbyHotelType: details.hotel_class || "Hotel"
      };
    });

    this.nearbyHotels = hotels;
    this.updateDisplayedHotels(Math.min(this.hotelsToDisplay, hotels.length));
  }

  /**
   * Extract first cuisine type or return default
   */
  private extractCuisine(cuisineArray: any): string {
    if (Array.isArray(cuisineArray) && cuisineArray.length > 0) {
      return cuisineArray[0]?.name?.charAt(0).toUpperCase() + cuisineArray[0]?.name?.slice(1) || "various";
    }
    return "Various";
  }

  getAttractionPhotos(): void {
    this.tripAdvisorApi.displayDestinationPhotos(this.attractionLocationID).subscribe({
      next: (results) => {
        for (let index = 0; index < 5; index++) {
          const photo = results.data?.[index].images?.original?.url;
          const photo_backup = results.data?.[index].images?.large?.url;
          this.attractionImages.push(photo || photo_backup || 'assets/picture_failed.png');
        }
      },
      error: (error) => {
        console.error('Error fetching attraction photos:', error);
      }
    });
  }

  nearbyTrunc(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  workDay(): number {
    let currentDay = new Date().getDay();
    return currentDay > 0 ? currentDay - 1 : 6;
  }

  private updateDisplayedRestaurants(count: number): void {
    this.displayedRestaurants = this.nearbyRestaurants?.slice(0, count) || [];
  }

  private updateDisplayedHotels(count: number): void {
    this.displayedHotels = this.nearbyHotels?.slice(0, count) || [];
  }


}
