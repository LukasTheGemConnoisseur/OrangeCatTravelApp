import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';

@Component({
  selector: 'app-suggested-travel-destinations',
  templateUrl: './suggested-travel-destinations.component.html',
  styleUrls: ['./suggested-travel-destinations.component.css']
})
export class SuggestedTravelDestinationsComponent implements OnInit {
  minTravelId: number = 28974;
  maxTravelId: number = 60899;
  getRandomTravelId(): number {
    return Math.floor(
      Math.random() * (this.maxTravelId - this.minTravelId + 1) + this.minTravelId
    );
  }
  destinations: any[] = [];

  constructor(
    private router: Router,
    private tripAdvisorApi: TripAdvisorApiService
  ) { }

  ngOnInit() {
    this.suggested();  // Call function when component loads
  }

  suggested() {
    const destinationRequests = [];
    const photoRequests = [];

  for (let i = 0; i < 4; i++) {
    const randomId = this.getRandomTravelId();
    console.log('Fetching data for Location ID:', randomId);

    // Request for destination details
    const destinationRequest = this.tripAdvisorApi.displaySuggestedDestinations(randomId).toPromise();
    destinationRequests.push(destinationRequest);

    // Request for destination photo
    const photoRequest = this.tripAdvisorApi.displaySuggestedDestinationsPhotos(randomId).toPromise();
    photoRequests.push(photoRequest);
  }

    // Wait for both sets of requests (destinations and photos) to finish
    Promise.all([Promise.all(destinationRequests), Promise.all(photoRequests)])
      .then(([destinationResults, photoResults]) => {
        // Combine destination data with photo data
        this.destinations = destinationResults.map((result, index) => ({
          name: result.name || 'Unknown Destination',
          image: photoResults[index]?.data?.[0]?.images?.thumbnail?.url || 'assets/tokyo.jpg',
          link: result.web_url || '#'
        }));

        console.log('All destinations with photos loaded:', this.destinations);
      })
      .catch((error) => {
        console.error('Error fetching search results or photos:', error);
      });
}


}
