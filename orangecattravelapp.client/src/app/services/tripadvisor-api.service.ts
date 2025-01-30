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
    console.log('Request parameters:', params);
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
}
