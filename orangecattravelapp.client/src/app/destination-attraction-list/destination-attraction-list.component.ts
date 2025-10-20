import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';
export interface Place {
  name: string;
  image: string;
  location_id: number;
  description: string;
  rating: string;
  num_reviews: string;
}

@Component({
  selector: 'app-destination-attraction-list',
  templateUrl: './destination-attraction-list.component.html',
  styleUrls: ['./destination-attraction-list.component.css']
})
export class DestinationAttractionListComponent implements OnInit {
  attractions: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  destinationParam: string = '';
  searchResults: any;
  locationId: number = 0;
  destinationName: string = '';

  adventures: Place[] = [
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' },
    { name: 'N/A', image: 'assets/picture_failed.png', location_id: 0, description: 'N/A', rating: 'N/A', num_reviews: 'N/A' }
  ];

  showFilters: boolean = false;
  filters: any = {
    filter1: '',
    filter2: ''
  };

  constructor
    (private router: Router,
    private route: ActivatedRoute,
    private tripAdvisorApi: TripAdvisorApiService) { }

  ngOnInit(): void {

    this.destinationParam = this.route.snapshot.paramMap.get('destination') || '';

    // Read destinationName and adventures passed via navigation state (See All button)
    if (history.state.destinationName) {
      this.destinationName = history.state.destinationName;
      console.log('Received destinationName via state:', this.destinationName);
    }

    if (history.state.attractions) {
      this.attractions = history.state.attractions;
      console.log('Received adventures via state:', this.attractions);
    }

    this.loadAttractions();
  }

  loadAttractions() {

    for (let j = 0; j < 9; j++) {
      /*assigning attraction names to our arrays for easy access*/
      this.adventures[j].name = this.attractions[j]?.name || 'N/A';

      /*assigning attraction IDs to our arrays for easy access*/
      this.adventures[j].location_id = this.attractions[j]?.location_id || 0;

      /*assigning attraction photos to our arrays for easy access*/
      if (this.adventures[j].location_id) {
        this.adventures[j].image = this.attractions[j]?.image || 'assets/picture_failed.png';
      }

      /*Obtain attraction details*/
      this.tripAdvisorApi.displayDestinationAttractionDetails(this.adventures[j].location_id).subscribe({
        next: (results) => {
          console.log('destination attraction details:', results);
          this.adventures[j].description = results.description || ''
          this.adventures[j].rating = results.rating || 'N/A'
          this.adventures[j].num_reviews = results.num_reviews || ''
          
        },
        error: (error) => {
          console.error('Error fetching attraction details:', error);
        }
      });
    }

  }

  loadMore(): void {
    //this.currentPage++;
    //this.loadAttractions();
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    // Add logic to filter attractions based on the filters
    console.log('Applying filters:', this.filters);
    this.showFilters = !this.showFilters;
    // Example: Filter attractions locally
    // this.attractions = this.attractions.filter(attraction => {
    //   return attraction.name.includes(this.filters.filter1) &&
    //          attraction.description.includes(this.filters.filter2);
    // });
  }
  resetFilters(): void {
    this.filters = { filter1: '', filter2: '' };
  }

}
