import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';

  constructor(private router: Router) { }

  search() {
    console.log('Search term:', this.searchTerm);
    // Add your search functionality here (e.g., call a service or update a search results component)
    // Navigate to the DestinationOverviewComponent
    this.router.navigate(['/destination-overview']);

  }
}
