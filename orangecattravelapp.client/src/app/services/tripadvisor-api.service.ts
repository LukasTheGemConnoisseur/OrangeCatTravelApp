import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripAdvisorApiService {

  private cache = new Map<string, any>(); // In-memory cache
  private proxyUrl = 'https://localhost:7000/api/proxy'; // Backend proxy URL


  constructor(private http: HttpClient) { }

  searchDestinations(searchTerm: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const params = { searchQuery: encodedSearchTerm };
    return this.http.get<any>(`${this.proxyUrl}/search`, {params });
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
      console.log(`Cache hit for ${cacheKey}`);
      return of(this.cache.get(cacheKey)); // Return cached data
    }

    console.log(`Cache miss for ${cacheKey}`);
    return this.http.get(`${this.proxyUrl}/destinationPhoto/`, { params }).pipe(
      tap((data) => this.cache.set(cacheKey, data)) // Cache the response
    );
  }

  // Example: Fetch destination description with caching
  displayDestinationDescription(locationId: number): Observable<any> {
    const params = { locationId: locationId };
    const cacheKey = `description-${locationId}`;
    if (this.cache.has(cacheKey)) {
      console.log(`Cache hit for ${cacheKey}`);
      return of(this.cache.get(cacheKey)); // Return cached data
    }

    console.log(`Cache miss for ${cacheKey}`);
    return this.http.get(`${this.proxyUrl}/destinationDescription/`, {params}).pipe(
      tap((data) => this.cache.set(cacheKey, data)) // Cache the response
    );
  }
  displayDestinationAttractions(latLong: string, placeType: string): Observable<any> {
    const params = { latLong: latLong, category: placeType };
    const cacheKey = `attractions-${latLong}-${placeType}`;
    if (this.cache.has(cacheKey)) {
      console.log(`Cache hit for ${cacheKey}`);
      return of(this.cache.get(cacheKey)); // Return cached data
    }

    console.log(`Cache miss for ${cacheKey}`);
    return this.http.get(`${this.proxyUrl}/destinationAttractions/`, { params }).pipe(
      tap((data) => this.cache.set(cacheKey, data)) // Cache the response
    );
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
}
