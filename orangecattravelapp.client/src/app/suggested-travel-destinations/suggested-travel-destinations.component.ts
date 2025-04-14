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
  travelIdArray: number[] = [35805, 42139, 45963, 60403, 37835, 60750, 60898, 60763, 60713, 34515, 34438, 60982, 32655, 60878, 54171, 60864, 60745, 55229, 55197, 30196, 60811, 60922, 60097, 33388, 60933, 31310, 60974, 60360, 43323, 44881];
  destinations: any[] = []; // Stores the final combined data

  constructor(
    private router: Router,
    private tripAdvisorApi: TripAdvisorApiService
  ) { }

  ngOnInit() {
    this.suggested(); // Call function when component loads
  }

  getRandomTravelId(): number {
    const index: number = Math.floor(Math.random() * this.travelIdArray.length);
    const result: number = this.travelIdArray[index];
    return result;
  }

  suggested() {
    const destinationRequests: Promise<Destination>[] = [];
    const photoRequests: Promise<Photo>[] = [];
    const randomIdArray: number[] = [];

    for (let i = 0; i < 4; i++) {
      const randomId = this.getRandomTravelId();

      if (randomIdArray.includes(randomId)) {
        i--
        continue;

      }
      else {
        randomIdArray.push(randomId)
        const destinationRequest = this.tripAdvisorApi
          .displaySuggestedDestinations(randomId)
          .toPromise();

        const photoRequest = this.tripAdvisorApi
          .displaySuggestedDestinationsPhotos(randomId)
          .toPromise()
          .catch((error) => {
            console.error("Error fetching photo:", error);
            return { data: [] }; // Return an empty data array to prevent errors
          });
        destinationRequests.push(destinationRequest);
        photoRequests.push(photoRequest);
      }
    }

    // Wait for all requests to finish
    Promise.all([Promise.all(destinationRequests), Promise.all(photoRequests)])
      .then(([destinationResults, photoResults]) => {

        // Combine destination data with photo data
        this.destinations = destinationResults.map((result, index) => ({
          name: result.name || 'Unknown Destination',
          image:
            photoResults[index]?.data[0]?.images?.large?.url ||
            'assets/picture_failed.png',
          navigate: () => {
            console.log('Navigating to:', result.name); // Debugging log
            console.log('State being passed:', result); // Debugging log
            this.router.navigate(['/destination-overview', result.name.replace(/\s+/g, '-').toLowerCase()], {
              state: { searchResults: result }
            });
          }
        }));
      })
      .catch((error) => {
        console.error('Error fetching search results or photos:', error);
      });
  }
}
