import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripAdvisorApiService {
  private cache = new Map<string, any>();
  private proxyUrl = 'https://localhost:7000/api/proxy';

  constructor(private http: HttpClient) { }

  searchDestinations(searchTerm: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const params = { searchQuery: encodedSearchTerm };
    return this.http.get<any>(`${this.proxyUrl}/search`, { params });
  }

  searchNearbyAttractions(searchTerm: string, latLong: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const params = { searchQuery: encodedSearchTerm, category: "attractions", latLong: latLong };
    return this.http.get<any>(`${this.proxyUrl}/searchNearbyAttractions`, { params });
  }

  searchNearbyQuery(latLong: string, category: string): Observable<any> {
    const params = {latLong: latLong, category: category};
    return this.http.get<any>(`${this.proxyUrl}/searchNearbyQuery`, { params });
  }

  searchRestaurants(searchTerm: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const params = { searchQuery: encodedSearchTerm, category: "restaurants" };
    return this.http.get<any>(`${this.proxyUrl}/search`, { params });
  }

  displaySuggestedDestinations(randomID: number): Observable<any> {
    const params = { locationId: randomID };
    return this.http.get<any>(`${this.proxyUrl}/suggested`, { params });
  }

  displaySuggestedDestinationsPhotos(randomID: number): Observable<any> {
    const params = { locationId: randomID };
    return this.http.get<any>(`${this.proxyUrl}/suggestedPhoto`, { params });
  }

  displayDestinationPhotos(locationId: number): Observable<any> {
    const params = { locationId: locationId };
    const cacheKey = `photos-${locationId}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.proxyUrl}/destinationPhoto/`, { params }).pipe(
      delay(250),  // Add a small delay between requests
      tap(data => this.cache.set(cacheKey, data))
    );
  }

  displayDestinationDescription(locationId: number): Observable<any> {
    const params = { locationId: locationId };
    const cacheKey = `description-${locationId}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.proxyUrl}/destinationDescription/`, { params }).pipe(
      tap(data => this.cache.set(cacheKey, data))
    );
  }

  displayDestinationAttractions(searchTerm: string, placeType: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const params = { searchQuery: encodedSearchTerm, category: placeType };
    const cacheKey = `attractions-${encodedSearchTerm}-${placeType}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.proxyUrl}/destinationAttractions/`, { params }).pipe(
      tap(data => this.cache.set(cacheKey, data))
    );
  }

  displayDestinationAttractionDetails(locationId: number): Observable<any> {
    const params = { locationId: locationId };
    const cacheKey = `descriptions-${locationId}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    return this.http.get(`${this.proxyUrl}/destinationDescription/`, { params }).pipe(
      delay(250),  // Add a small delay between requests
      tap(data => this.cache.set(cacheKey, data))
    );
  }
}

  //Lat long
  //displayDestinationHotels(destinationID: number): Observable<any> {
  //  const params = { locationId: destinationID };
  //Lat long
  //displayDestinationAttractionsPhotos(destinationID: number): Observable<any> {
  //  const params = { locationId: destinationID };
  //}
  //displayDestinationHotelsPhotos(destinationID: number): Observable<any> {
  //  const params = { locationId: destinationID };
  //displayDestinationRestaurantsPhotos(destinationID: number): Observable<any> {
  //  const params = { locationId: destinationID };
  //}
  //}
