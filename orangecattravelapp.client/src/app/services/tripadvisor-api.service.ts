import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripAdvisorApiService {
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

  //displayDestinationPhotos(destinationID: number): Observable<any> {
  //  const params = { locationId: destinationID };
  //}

  displayDestinationDescription(destinationID: number): Observable<any> {
    const params = { locationId: destinationID };
    return this.http.get<any>(`${this.proxyUrl}/destinationDescription`, { params });
  }
  displayDestinationAttractions(latLong: string, category: string): Observable<any> {
    const params = { latLong: latLong, category : category };
    return this.http.get<any>(`${this.proxyUrl}/destinationAttractions`, { params });
  }
  //Lat long
  //displayDestinationHotels(destinationID: number): Observable<any> {
  //  const params = { locationId: destinationID };
  //Lat long
  //displayDestinationRestaurants(destinationID: number): Observable<any> {
  //  const params = { locationId: destinationID };
  //}
  //}
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
