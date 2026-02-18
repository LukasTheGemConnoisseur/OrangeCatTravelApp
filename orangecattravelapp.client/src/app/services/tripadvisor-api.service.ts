import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { tap, delay, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripAdvisorApiService {
  private cache = new Map<string, any>();
  private proxyUrl = 'https://localhost:7000/api/proxy';
  private readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;
  private readonly REQUEST_DELAY_MS = 100; // Add 200ms delay between requests
  private lastRequestTime: number = 0;

  constructor(private http: HttpClient) {
    this.loadCacheFromLocalStorage();
  }

  private loadCacheFromLocalStorage(): void {
    try {
      const cachedData = localStorage.getItem('tripAdvisorCache');
      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        Object.entries(parsedCache).forEach(([key, value]: [string, any]) => {
          if (value.expiry && value.expiry > Date.now()) {
            this.cache.set(key, value.data);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  private saveCacheToLocalStorage(): void {
    try {
      const cacheToSave: Record<string, any> = {};
      this.cache.forEach((value, key) => {
        cacheToSave[key] = {
          data: value,
          expiry: Date.now() + this.CACHE_EXPIRY_MS
        };
      });
      localStorage.setItem('tripAdvisorCache', JSON.stringify(cacheToSave));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Apply rate limiting delay before making requests
   */
  private applyRateLimit(): Observable<number> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const delayNeeded = Math.max(0, this.REQUEST_DELAY_MS - timeSinceLastRequest);

    this.lastRequestTime = now + delayNeeded;
    return delayNeeded > 0 ? timer(delayNeeded) : of(0);
  }

  private getFromCacheOrFetch<T>(
    cacheKey: string,
    fetchFn: () => Observable<T>
  ): Observable<T> {
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey) as T);
    }
    return this.applyRateLimit().pipe(
      concatMap(() => fetchFn()),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.saveCacheToLocalStorage();
      })
    );
  }

  searchDestinations(searchTerm: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const cacheKey = `search-destinations-${encodedSearchTerm}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { searchQuery: encodedSearchTerm };
      return this.http.get<any>(`${this.proxyUrl}/search`, { params });
    });
  }

  searchNearbyAttractions(searchTerm: string, latLong: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const cacheKey = `attractions-nearby-${encodedSearchTerm}-${latLong}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { searchQuery: encodedSearchTerm, category: "attractions", latLong: latLong };
      return this.http.get<any>(`${this.proxyUrl}/searchNearbyAttractions`, { params });
    });
  }

  searchNearbyQuery(latLong: string, category: string): Observable<any> {
    const cacheKey = `nearby-${latLong}-${category}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { latLong: latLong, category: category };
      return this.http.get<any>(`${this.proxyUrl}/searchNearbyQuery`, { params });
    });
  }

  searchRestaurants(searchTerm: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const cacheKey = `search-restaurants-${encodedSearchTerm}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { searchQuery: encodedSearchTerm, category: "restaurants" };
      return this.http.get<any>(`${this.proxyUrl}/search`, { params });
    });
  }

  displaySuggestedDestinations(randomID: number): Observable<any> {
    const cacheKey = `suggested-${randomID}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { locationId: randomID };
      return this.http.get<any>(`${this.proxyUrl}/suggested`, { params });
    });
  }

  displaySuggestedDestinationsPhotos(randomID: number): Observable<any> {
    const cacheKey = `suggested-photo-${randomID}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { locationId: randomID };
      return this.http.get<any>(`${this.proxyUrl}/suggestedPhoto`, { params });
    });
  }

  displayDestinationPhotos(locationId: number): Observable<any> {
    const cacheKey = `photos-${locationId}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { locationId: locationId };
      return this.http.get(`${this.proxyUrl}/destinationPhoto/`, { params });
    });
  }

  displayDestinationDescription(locationId: number): Observable<any> {
    const cacheKey = `description-${locationId}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { locationId: locationId };
      return this.http.get(`${this.proxyUrl}/destinationDescription/`, { params });
    });
  }

  displayDestinationAttractions(searchTerm: string, placeType: string): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const cacheKey = `attractions-${encodedSearchTerm}-${placeType}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { searchQuery: encodedSearchTerm, category: placeType };
      return this.http.get(`${this.proxyUrl}/destinationAttractions/`, { params });
    });
  }

  displayDestinationAttractionDetails(locationId: number): Observable<any> {
    const cacheKey = `descriptions-${locationId}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { locationId: locationId };
      return this.http.get(`${this.proxyUrl}/destinationDescription/`, { params });
    });
  }

  displayLocationReviews(locationId: number, offset: number = 0): Observable<any> {
    const cacheKey = `reviews-${locationId}-${offset}`;
    return this.getFromCacheOrFetch(cacheKey, () => {
      const params = { locationId: locationId, offset: offset };
      return this.http.get(`${this.proxyUrl}/locationReview/`, { params });
    });
  }

  clearCache(): void {
    this.cache.clear();
    localStorage.removeItem('tripAdvisorCache');
  }
}
