import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';

interface Reviews {
  id: number;
  location_id: number;
  location_name: string;
  published_date: string;
  rating: number;
  title: string;
  text: string;
  user: {
    username: string;
    avatar?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
  };
}

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit, OnChanges{
  @Input() location_id: number = 0;

  allReviews: Reviews[] = [];
  displayedReviews: Reviews[] = [];
  currentOffset: number = 0;
  isLoadingMore: boolean = false;
  hasMoreReviews: boolean = true;

  constructor(private tripAdvisorApi: TripAdvisorApiService) { }

  ngOnInit(): void {
    // Component initialized
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Checks if location_id has changed and if it is valid
    if (changes['location_id'] && this.location_id > 0) {
      this.resetReviews();
      this.loadReviews();
    }
  }

  private resetReviews(): void {
    //Clears all data when location changes
    this.allReviews = [];
    this.displayedReviews = [];
    this.currentOffset = 0;
    this.isLoadingMore = false;
    this.hasMoreReviews = true;
  }

  private loadReviews(): void {
    // Orevents multiple simultaneous requests
    if (this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    console.log(`Reviews component loading reviews for location ${this.location_id} at offset ${this.currentOffset}`);

    this.tripAdvisorApi.displayLocationReviews(this.location_id, this.currentOffset).subscribe({
      next: (results) => {
        // Stores the new reviews from the API Response
        const newReviews: Reviews[] = results.data || [];
        //console.log(`API Response:`, {
        //  rawResults: results,
        //  reviewCount: newReviews.length,
        //  reviews: newReviews,
        //  currentOffset: this.currentOffset,
        //  totalReviewsLoaded: this.allReviews.length + newReviews.length
        //});

        //Checks to see if there are any reviews in the first place
        if (this.currentOffset === 0 && newReviews.length === 0) {
          console.warn('No reviews available for this location');
          this.hasMoreReviews = false;
          this.isLoadingMore = false;
          return;
        }

        //Adds the new reviews to AllReviews
        this.allReviews.push(...newReviews);

        //Updates displayed reviews
        this.displayedReviews = this.allReviews.slice(0, this.allReviews.length);

        //Update offset
        this.currentOffset += 5;

        // Checks if there are more reviews available
        this.hasMoreReviews = newReviews.length >= 5 && this.currentOffset <= 5;

/*        console.log(`Load complete. Next offset will be: ${this.currentOffset}, has more: ${this.hasMoreReviews}`)*/
        this.isLoadingMore = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.isLoadingMore = false;
        this.hasMoreReviews = false;
      }
    });
  }

  loadMoreReviews(): void {
    //Loads more reviews when user click the load more button
    if (this.hasMoreReviews && !this.isLoadingMore) {
      this.loadReviews();
    }
  }
}
