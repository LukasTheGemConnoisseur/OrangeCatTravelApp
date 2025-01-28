import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';

// Define types
interface Destination {
  name: string;
  web_url: string;
}

interface Photo {
  data: Array<{
    images: {
      large: {
        url: string;
      };
    };
  }>;
}

@Component({
  selector: 'app-suggested-travel-destinations',
  templateUrl: './suggested-travel-destinations.component.html',
  styleUrls: ['./suggested-travel-destinations.component.css'],
})
export class SuggestedTravelDestinationsComponent implements OnInit {
  minTravelId: number = 28974;
  maxTravelId: number = 60899;
  destinations: any[] = []; // Stores the final combined data

  constructor(
    private router: Router,
    private tripAdvisorApi: TripAdvisorApiService
  ) { }

  ngOnInit() {
    this.suggested(); // Call function when component loads
  }

  getRandomTravelId(): number {
    return Math.floor(
      Math.random() * (this.maxTravelId - this.minTravelId + 1) + this.minTravelId
    );
  }

  suggested() {
    const destinationRequests: Promise<Destination>[] = [];
    const photoRequests: Promise<Photo>[] = [];

    for (let i = 0; i < 4; i++) {
      const randomId = this.getRandomTravelId();
      console.log('Fetching data for Location ID:', randomId);

      const destinationRequest = this.tripAdvisorApi
        .displaySuggestedDestinations(randomId)
        .toPromise();
      destinationRequests.push(destinationRequest);

      this.tripAdvisorApi
        .displaySuggestedDestinationsPhotos(randomId)
        .toPromise()
        .then((photoResult) => {
          const photoUrl = photoResult?.data?.[0]?.images?.large?.url;
          if (photoUrl) {
            photoRequests.push(Promise.resolve(photoResult));
          } else {
            console.warn('Photo is missing, retrying...');
            destinationRequests.pop();
            i--; // Retry the current iteration
          }
        })
        .catch((error) => {
          console.error('Error fetching photo:', error);
          destinationRequests.pop();
          i--; // Retry the current iteration
        });
    }

    // Wait for all requests to finish
    Promise.all([Promise.all(destinationRequests), Promise.all(photoRequests)])
      .then(([destinationResults, photoResults]) => {
        // Combine destination data with photo data
        this.destinations = destinationResults.map((result, index) => ({
          name: result.name || 'Unknown Destination',
          image:
            photoResults[index]?.data?.[0]?.images?.large?.url ||
            'assets/tokyo.jpg',
          link: result.web_url || '#',
        }));

        console.log('All destinations with photos loaded:', this.destinations);
      })
      .catch((error) => {
        console.error('Error fetching search results or photos:', error);
      });
  }

  retryFetchPhoto() {
    const newRandomId = this.getRandomTravelId();
    console.log('Retrying fetch for new Location ID:', newRandomId);
    return this.tripAdvisorApi
      .displaySuggestedDestinationsPhotos(newRandomId)
      .toPromise();
  }
}
