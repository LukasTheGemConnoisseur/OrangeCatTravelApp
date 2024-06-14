import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';

  constructor() { }

  search() {
    console.log('Search term:', this.searchTerm);
    // Add your search functionality here (e.g., call a service or update a search results component)
  }
}
