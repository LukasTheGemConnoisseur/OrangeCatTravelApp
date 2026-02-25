import { Injectable } from '@angular/core';

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type: 'attraction' | 'restaurant' | 'hotel';
  foodType?: string;
  hotelType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private readonly API_KEY = 'AIzaSyBFlROOIcMCwNErz3nIkWvgjSzUmLDqeGM';

  constructor() { }

  getApiKey(): string {
    return this.API_KEY;
  }

  // Convert latitude and longitude strings to numbers
  parseCoordinates(latLong: string): { lat: number; lng: number } | null {
    try {
      const [lat, lng] = latLong.split(',').map(coord => parseFloat(coord.trim()));
      return { lat, lng };
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return null;
    }
  }

  // Create a marker object from attraction data
  createAttractionMarker(attraction: any): MapMarker {
    return {
      lat: parseFloat(attraction.nearbyAttractionLatitude || attraction.latitude),
      lng: parseFloat(attraction.nearbyAttractionLongitude || attraction.longitude),
      title: attraction.nearbyAttractionName || attraction.name,
      description: `Rating: ${attraction.nearbyAttractionRating || 'N/A'} ⭐`,
      type: 'attraction'
    };
  }

  // Create markers from restaurant data
  createRestaurantMarker(restaurant: any): MapMarker {
    return {
      lat: parseFloat(restaurant.nearbyRestaurantLatitude),
      lng: parseFloat(restaurant.nearbyRestaurantLongitude),
      title: restaurant.nearbyRestaurantName,
      description: `${restaurant.nearbyRestaurantRating} ⭐ | ${restaurant.nearbyRestaurantPriceRange}`,
      type: 'restaurant',
      foodType: restaurant.nearbyRestaurantFoodType
    };
  }

  // Create markers from hotel data
  createHotelMarker(hotel: any): MapMarker {
    return {
      lat: parseFloat(hotel.nearbyHotelLatitude),
      lng: parseFloat(hotel.nearbyHotelLongitude),
      title: hotel.nearbyHotelName,
      description: `${hotel.nearbyHotelRating} ⭐ | ${hotel.nearbyHotelType}`,
      type: 'hotel',
      hotelType: hotel.nearbyHotelType
    };
  }
}
