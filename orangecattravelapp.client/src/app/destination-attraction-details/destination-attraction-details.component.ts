import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
import { forkJoin, from, lastValueFrom, Observable, timer, throwError } from 'rxjs';
import { mergeMap, retryWhen, concatMap, delay } from 'rxjs/operators';

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
  attractionLocationID: number = 0; // Default location ID
  attractionName: string = ""; // Default name
  attractionSubCategory: string = ""; // Default sub category
  businessHoursOpening: string = "10:00 AM"; // Default opening hours
  businessHoursClosing: string = "5:00 PM"; // Default closing hours
  businessHours: string = ""
  attractionWebsite: string = "" // Default website
  attractionAddress: string = ""; // Default address
  attractionPhone: string = ""; // Default phone number
  encodedAddress: string = ""
  attractionRating: number = 4.0 // Default value
  attractionReviewNumber: number = 152 // Default value
  attractionImages: string[] = [];
  attractionLocationImage: string = 'https://via.placeholder.com/150';
  attractionDescription: string = ''
  attractionParam: string = '';
  lat: string = '';
  long: string = '';
  latLong: string = '';

  // Define the displayedRestaurants array using the Restaurants type
  displayedRestaurants: Restaurants[] = [];
  restaurantsToDisplay = 10; // Number of restaurants to display initially
  displayedHotels: Hotels[] = [];
  hotelsToDisplay = 10; // Number of restaurants to display initially

  nearbyRestaurants: Restaurants[] = [
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
    {
      nearbyRestaurantId: 0,
      nearbyRestaurantLatitude: "",
      nearbyRestaurantLongitude: "",
      nearbyRestaurantLatLong: "",
      nearbyRestaurantName: "",
      nearbyRestaurantRating: 0,
      nearbyRestaurantReviewCount: 0,
      nearbyRestaurantDistance: 0,
      nearbyRestaurantPriceRange: "",
      nearbyRestaurantFoodType: ""
    },
  ];

  nearbyHotels: Hotels[] = [
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
    {
      nearbyHotelId: 0,
      nearbyHotelLatitude: "",
      nearbyHotelLongitude: "",
      nearbyHotelLatLong: "",
      nearbyHotelName: "",
      nearbyHotelRating: 0,
      nearbyHotelReviewCount: 0,
      nearbyHotelDistance: 0,
      nearbyHotelType: ""
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripAdvisorApi: TripAdvisorApiService) {
    this.encodedAddress = encodeURIComponent(this.attractionAddress);
    this.displayedRestaurants = this.nearbyRestaurants.slice(0, this.restaurantsToDisplay);
    this.displayedHotels = this.nearbyHotels.slice(0, this.hotelsToDisplay);

}

  ngOnInit(): void {

    // Parameters passed via navigation state (view details button)
    console.log('Full attraction history state', history.state);
    if (history.state.attractionObject) {
      const passedAttractionData = history.state.attractionObject;
      this.attractionName = passedAttractionData.name;
      this.attractionLocationID = passedAttractionData.location_id;
      this.attractionSubCategory = passedAttractionData.group;
      this.attractionRating = passedAttractionData.rating;
      this.attractionReviewNumber = passedAttractionData.num_reviews;
      this.attractionDescription = passedAttractionData.description;
    }

    this.getAttractionDetails()
    this.getAttractionPhotos()
    
  }

  //Function to get attraction details, nearby restaurants and hotels
  getAttractionDetails() {
    this.tripAdvisorApi.displayDestinationDescription(this.attractionLocationID).pipe(
      mergeMap(detailsResults => {
        const newAttractionData = detailsResults;
        console.log(newAttractionData)
        this.businessHours = detailsResults?.hours?.weekday_text[this.workDay()] || "Hours Not Listed"
        this.attractionAddress = detailsResults.address_obj.address_string
        this.encodedAddress = encodeURIComponent(this.attractionAddress);
        this.attractionDescription = detailsResults.description;
        this.attractionWebsite = detailsResults.website;
        this.attractionPhone = detailsResults.phone;
        this.lat = detailsResults.latitude;
        this.long = detailsResults.longitude;
        this.latLong = this.lat + ',' + this.long;

        return this.tripAdvisorApi.searchNearbyQuery(this.latLong, "restaurants");
      }),
      mergeMap(restaurantsResults => {
        //Get basic restaurant Data
        const nearbyRestaurantData = restaurantsResults;
        /*console.log(nearbyRestaurantData)*/
        this.updateDisplayedRestaurants(restaurantsResults.data.length);

        for (let i = 0; i < restaurantsResults.data.length; i++) {
/*          console.log(restaurantsResults.data[i])*/
          let restaurantIdInt: number = Number(restaurantsResults.data[i].location_id);
          let distanceInt: number = Number(restaurantsResults.data[i].distance);
          let distanceRounded: number = this.nearbyTrunc(distanceInt, 2);

          this.nearbyRestaurants[i].nearbyRestaurantId = restaurantIdInt;
          this.nearbyRestaurants[i].nearbyRestaurantName = restaurantsResults.data[i].name;
          this.nearbyRestaurants[i].nearbyRestaurantDistance = distanceRounded;
        }

        const restaurantDetailsArray: { index: number; locationId: number }[] = restaurantsResults.data.map((restaurant: any, index: number) => ({
          index: index,
          locationId: Number(restaurant.location_id)
        }));

        return from(restaurantDetailsArray).pipe(
          mergeMap(item =>
            this.tripAdvisorApi.displayDestinationDescription(item.locationId).pipe(
              delay(2000),
              mergeMap(details => Promise.resolve({ details, index: item.index }))
            )
          )
        );
      }),
      // After all restaurant details are fetched, get hotels
      mergeMap(() => {
        return this.tripAdvisorApi.searchNearbyQuery(this.latLong, "hotels");
      }),
      mergeMap(hotelResults => {
        // Store the basic hotel data
        const nearbyHotelData = hotelResults;
        /*console.log(nearbyHotelData)*/
        this.updateDisplayedHotels(hotelResults.data.length);

        for (let i = 0; i < hotelResults.data.length; i++) {
/*          console.log(hotelResults.data[i])*/
          let hotelIdInt: number = Number(hotelResults.data[i].location_id);
          let distanceInt: number = Number(hotelResults.data[i].distance);
          let distanceRounded: number = this.nearbyTrunc(distanceInt, 2);

          this.nearbyHotels[i].nearbyHotelId = hotelIdInt;
          this.nearbyHotels[i].nearbyHotelName = hotelResults.data[i].name;
          this.nearbyHotels[i].nearbyHotelDistance = distanceRounded;
        }

        // Create an array of objects that include both index and location_id
        const hotelDetailsArray: { index: number, locationId: number } [] = hotelResults.data.map((hotel: any, index: number) => ({
          index: index,
          locationId: Number(hotel.location_id)
        }));

        // Use from() to emit each hotel one at a time
        return from(hotelDetailsArray).pipe(
          delay (2000),
          mergeMap(item =>
            this.tripAdvisorApi.displayDestinationDescription(item.locationId).pipe(
              delay(5000),
              // Map the response to include the index so we know where to store it
              mergeMap(details => Promise.resolve({ details, index: item.index }))
            )
          )
        );
      })
    )
      .subscribe({
        next: (finalResult: any) => {
          // This is the last detail call result - you can handle it or just finish
          console.log(finalResult);
          console.log('All details fetched successfully');
        },
        error: (error) => {
          console.error('Error in chain:', error);
        }
      });
  }

  //Api call to get attraction photos
  getAttractionPhotos() {
    this.tripAdvisorApi.displayDestinationPhotos(this.attractionLocationID).subscribe({
      next: (results) => {
        const attractionPhotos = results;
        console.log(attractionPhotos)

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

  //Function to truncate nearby distance
  nearbyTrunc(value: number, decimals: number) {
      const factor = Math.pow(10, decimals);
      return Math.round(value * factor) / factor
  }

  //Function to obtain correct index for business hours
  workDay() {
    let currentDay = new Date().getDay()
    if (currentDay > 0) {
      return currentDay - 1;
    } else {
      return currentDay = 6;
    }
  }

  private updateDisplayedRestaurants(count: number) {
    this.displayedRestaurants = this.nearbyRestaurants.slice(0, count);
  }

  private updateDisplayedHotels(count: number) {
    this.displayedHotels = this.nearbyHotels.slice(0, count);
  }

};
