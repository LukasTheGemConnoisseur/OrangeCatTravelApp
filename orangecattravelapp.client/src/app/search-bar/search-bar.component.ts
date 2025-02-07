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
    //Formats the search term to a url friendly form, removing the whitespace, pretty cool.
    const formattedTerm = this.searchTerm.replace(/\s+/g, '-').toLowerCase();

    this.tripAdvisorApi.searchDestinations(this.searchTerm).subscribe(
      (results) => {
        console.log('Search results:', results);
        // Navigate to the results page with the results
        this.router.navigate(['/destination-overview', formattedTerm], { state: { searchResults: results }
        });
      },
      (error) => {
        console.error('Error fetching search results:', error);
      }
    );
  }
}
