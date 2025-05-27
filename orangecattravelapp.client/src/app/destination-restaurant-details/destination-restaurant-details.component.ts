import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripAdvisorApiService } from '../services/tripadvisor-api.service';

interface Period {
  open: {
    day: number;
    time: string; // e.g., "1100"
  };
  close: {
    day: number;
    time: string;
  };
}

@Component({
  selector: 'app-destination-restaurant-details',
  templateUrl: './destination-restaurant-details.component.html',
  styleUrls: ['./destination-restaurant-details.component.css']
})

export class DestinationRestaurantDetailsComponent {

  restaurant: any;
  slug: string | null = null;
  locationId: number = 0;

  restaurantName: string = "Placeholder"; //Default Value
  restaurantRating: number = 0 // Default value
  restaurantReviewNumber: number = 0 // Default value
  restaurantPriceAverage: string = "" // Default value
  restaurantReview1: string = "This restaurant had great pancakes and even better chicken strips!" // Default value
  restaurantReview2: string = "Although the wait time was over an hour, we did get some incredible filet mignon! Worth every dollar." // Default value
  phone: string = "" // Default value
  website: string = "" // Default value
  address: string = "" // Default value
  encodedAddress: string = ""
  hours: any = "" // Default value
  periods: any[] = [];
  restaurantStatus: any;
  food: string = "4.5" // Default value
  service: string = "4.5" // Default value
  value: string = "4.0" // Default value
  atmosphere: string = "5" // Default value
  restaurantAbout: string = "In a state where Eating Meat is a religion, there’s only one place to fill up on your favorite fare: Kaminski’s Chop House, voted #1 Best Steakhouse in Wisconsin by EatThis.com in 2021 AND 2022! Treat yourself to the sublime pleasures of hand-cut, dry-aged beef, a variety of seafood delights, well-paired wines, and extraordinary service. Think that isn’t enough? Our view can top it! Request a table by the window and enjoy breathtaking views of the scenic beauty the Wisconsin River provides. Locally owned and operated for over 15 years, the Kaminski Family opened Chop House in 2006 with one goal in mind - offer the best quality product, with even better service. Join us for a dining experience that celebrates the best of the best." // Default value
  restaurantCuisines: string = "" // Default value
  restaurantCuisineArray: any[] = []
  restaurantFeatures: string = "Takeout, Reservations, Private Dining, Seating, Parking Available, Highchairs Available, Wheelchair Accessible, Serves Alcohol, Full Bar, Free Wifi, Accepts Credit Cards, Table Service, Live Music, Gift Cards Available" // Default value
  restaurantImages: string[] = [
    'assets/paris.jpg',
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripAdvisorApi: TripAdvisorApiService) {
    this.encodedAddress = encodeURIComponent(this.address);
  }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.restaurant = nav?.extras?.state?.['restaurant'];

    if (this.restaurant) {
      console.log('Loaded restaurant from state:', this.restaurant);
    } else {
      this.slug = this.route.snapshot.paramMap.get('slug');
      console.log('Slug from URL:', this.slug);

      if (this.slug) {
        this.fetchRestaurantBySlug(this.slug);
      }
    }
  }

  fetchRestaurantBySlug(slug: string) {
    this.tripAdvisorApi.searchRestaurants(slug).subscribe({
      next: (restaurant) => {
        this.restaurant = restaurant;
        this.locationId = this.restaurant?.data[0]?.location_id;
        console.log('Fetched from API:', this.restaurant);
        console.log("restaurant location_id:", this.locationId)
        this.loadRestaurantDescription();
      },
      error: (err) => {
        console.error('Failed to fetch restaurant:', err);
        // Optional: redirect to a 404 page
      }
    });
  }

  loadRestaurantDescription() {
    this.tripAdvisorApi.displayDestinationDescription(this.locationId).subscribe({
      next: (results: any) => {
        console.log('restaurant details:', results);
        this.restaurantName = results.name;
        this.restaurantRating = results.rating;
        this.restaurantReviewNumber = results.num_reviews;
        this.restaurantPriceAverage = results.price_level;
        this.restaurantCuisineArray = results.cuisine ? [...results.cuisine] : [];
        this.restaurantCuisines = this.restaurantCuisineArray.map((c: any) => c.localized_name).join(', ');
        this.address = results.address_obj.address_string;
        this.phone = results.phone;
        this.website = results.website;
        this.periods = results.hours.periods;
        this.restaurantStatus = this.getRestaurantStatus(this.periods)
        this.hours = this.restaurantStatus.message;
        console.log('status:', this.restaurantStatus);
      },
      error: (error: any) => {
        console.error('Error fetching destination description:', error);
      }
    });
  }

  getRestaurantStatus(periods: Period[]): { isOpen: boolean; message: string } {
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // Sunday = 7
    const currentTime = now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');

    const todayPeriod = periods.find(p => p.open.day === currentDay);

    if (todayPeriod && currentTime >= todayPeriod.open.time && currentTime < todayPeriod.close.time) {
      return {
        isOpen: true,
        message: `Open now - Closes at ${this.formatTime(todayPeriod.close.time)}`
      };
    }

    for (let i = 0; i < 7; i++) {
      const nextDay = ((currentDay + i - 1) % 7) + 1;
      const period = periods.find(p => p.open.day === nextDay);

      if (!period) continue;

      if (i === 0 && currentTime < period.open.time) {
        return {
          isOpen: false,
          message: `Closed - Opens today at ${this.formatTime(period.open.time)}`
        };
      }

      if (i > 0) {
        const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return {
          isOpen: false,
          message: `Closed - Opens ${weekday[nextDay - 1]} at ${this.formatTime(period.open.time)}`
        };
      }
    }

    return {
      isOpen: false,
      message: "Closed - Opening hours not available"
    };
  }

  formatTime(t: string): string {
    const hour = parseInt(t.slice(0, 2), 10);
    const minute = t.slice(2);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = ((hour + 11) % 12 + 1);
    return `${displayHour}:${minute} ${ampm}`;
  }

};
