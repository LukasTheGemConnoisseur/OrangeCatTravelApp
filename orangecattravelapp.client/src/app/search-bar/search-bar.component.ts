import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';
  constructor(
    private router: Router,
    private tripAdvisorApi: TripAdvisorApiService
  ) { }

  search() {
    console.log('Search term:', this.searchTerm);
    this.tripAdvisorApi.searchDestinations(this.searchTerm).subscribe(
      (results) => {
        console.log('Search results:', results);
        // Navigate to the results page with the results
        this.router.navigate(['/destination-overview'], { state: { searchResults: results }
        });
      },
      (error) => {
        console.error('Error fetching search results:', error);
      }
    );
  }
}
