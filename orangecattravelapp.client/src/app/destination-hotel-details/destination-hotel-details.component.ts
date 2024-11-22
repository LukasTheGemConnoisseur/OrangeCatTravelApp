import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-destination-hotel-details',
  templateUrl: './destination-hotel-details.component.html',
  styleUrls: ['./destination-hotel-details.component.css']
})
export class DestinationHotelDetailsComponent implements OnInit {
  amenities: string[] = [];
  destinationName: string = "Wisconsin Dells" // Default value
  hotelName: string = "Atlantis Family Waterpark Hotel" // Default value
  hotelRating: number = 4.0 // Default value
  hotelReviewNumber: number = 152 // Default value
  hotelAddress: string = "250 Kalahari Boulevard, Pocono Manor, PA 18349" // Default value
  encodedAddress: string = ""
  hotelPriceAverage: string = "$" // Default value
  hotelPropertyType: string = "Hotel" // Default value
  hotelReview1: string = "The staff was very helpful and accommodating. However the hotel and pools need some loving. The rooms are cleaned, but old so there was mold growing and we could see and smell it(especially in the shower) which made my allergies, and sinuses act up. The carpeting in our room was snagged in multiple places. The pull out couch in our room just needs to go! It sagged in the middle and was not even possiable to sleep on because all you could feel was the metal under you.\nThe pools were in serious need of maintenance and updating.Also not enough towels at the pools and I wasn't there with a lot of other people there. I've stayed in many Choice hotels in the past, this hotel is NOT up to their standards.The staff however was great!" // Default value
  hotelReview2: string = "They upgraded our room to a larger suite. It was very big. But the jacuzzi tub had grime on the intake filter so we didn't use the jets. Beds were super comfy in this room but my daughter said the beds in her room were too hard. Indoor pool area was perfect for the Littles. One small slide in diar need of repair. We learned a lot for our first time and might be back again." // Default value
  hotelDescription: string = "Atlantis Family Waterpark Hotel is located right in the heart of Wisconsin Dells. Within walking distance to Noah's Ark, Mt. Olympus Water & Theme Park, Duck Rides, Big Foot Zip Line, Tommy Bartlett, Timbavati Wildlife Park and MANY restaurants. Our different indoor and outdoor waterparks ON-SITE are very family friendly and your best location if traveling with kids under 12 years old. Pools are open late. We have a ticket redemption game room, indoor whirlpool, pool basketball and slides/activities for all ages. Free Wifi. We recently added Kids Suites which include two queen size beds and BUNK BEDS! We have new carpet in the main building, public spaces and guest rooms. Call us now to plan your quaint family getaway!" // Default value
  hotelImages: string[] = [
    'assets/tokyo.jpg',
    'assets/newyork.jpg'
  ];
  hotelLocationImage: string = 'https://via.placeholder.com/150';

  location: number = 4.0; // Default value
  sleepQuality: number = 4.0; // Default value
  rooms: number = 4.0; // Default value
  service: number = 3.5; // Default value
  value: number = 3.0; // Default value
  cleanliness: number = 4.0; // Default value


  // Simulating hotel data for now, will be replaced by API data later
  nearbyRestaurants: Restaurants[] = [
    {
      nearbyRestaurantId: 1,
      nearbyRestaurantName: "High Rock Cafe",
      nearbyRestaurantRating: 4.7,
      nearbyRestaurantReviewCount: 955,
      nearbyRestaurantDistance: 0.16,
      nearbyRestaurantPriceRange: "$ - $$$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 2,
      nearbyRestaurantName: "Low Rock Cafe",
      nearbyRestaurantRating: 4.2,
      nearbyRestaurantReviewCount: 95,
      nearbyRestaurantDistance: 0.19,
      nearbyRestaurantPriceRange: "$ - $$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 3,
      nearbyRestaurantName: "Plateau Rock Cafe",
      nearbyRestaurantRating: 4.0,
      nearbyRestaurantReviewCount: 855,
      nearbyRestaurantDistance: 0.35,
      nearbyRestaurantPriceRange: "$$$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 4,
      nearbyRestaurantName: "High Rock Cafe",
      nearbyRestaurantRating: 4.7,
      nearbyRestaurantReviewCount: 955,
      nearbyRestaurantDistance: 0.16,
      nearbyRestaurantPriceRange: "$ - $$$",
      nearbyRestaurantFoodType: "American"
    },
    {
      nearbyRestaurantId: 5,
      nearbyRestaurantName: "High Rock Cafe",
      nearbyRestaurantRating: 4.7,
      nearbyRestaurantReviewCount: 955,
      nearbyRestaurantDistance: 0.16,
      nearbyRestaurantPriceRange: "$ - $$$",
      nearbyRestaurantFoodType: "American"
    },
  ];

  nearbyAttractions: Attractions[] = [
    {
      nearbyAttractionId: 1,
      nearbyAttractionName: "Mt. Olympus",
      nearbyAttractionRating: 4.7,
      nearbyAttractionReviewCount: 955,
      nearbyAttractionDistance: 0.16,
      nearbyAttractionType: "Water Park"
    },
    {
      nearbyAttractionId: 2,
      nearbyAttractionName: "Mt. Olympus",
      nearbyAttractionRating: 4.7,
      nearbyAttractionReviewCount: 955,
      nearbyAttractionDistance: 0.16,
      nearbyAttractionType: "Water Park"
    },
    {
      nearbyAttractionId: 3,
      nearbyAttractionName: "Mt. Olympus",
      nearbyAttractionRating: 4.7,
      nearbyAttractionReviewCount: 955,
      nearbyAttractionDistance: 0.16,
      nearbyAttractionType: "Water Park"
    },
    {
      nearbyAttractionId: 4,
      nearbyAttractionName: "Mt. Olympus",
      nearbyAttractionRating: 4.7,
      nearbyAttractionReviewCount: 955,
      nearbyAttractionDistance: 0.16,
      nearbyAttractionType: "Water Park"
    },
    {
      nearbyAttractionId: 5,
      nearbyAttractionName: "Mt. Olympus",
      nearbyAttractionRating: 4.7,
      nearbyAttractionReviewCount: 955,
      nearbyAttractionDistance: 0.16,
      nearbyAttractionType: "Water Park"
    },
  ];

  // Define the displayedRestaurants array using the Restaurants type
  displayedRestaurants: Restaurants[] = [];
  restaurantsToDisplay = 5; // Number of restaurants to display initially
  displayedAttractions: Attractions[] = [];
  attractionsToDisplay = 5; // Number of restaurants to display initially

  sortedAmenities: { [key: string]: string[] } = {};
  categories: { [key: string]: string[] } = {
    "Rooms": [
      "Suites", "Non-smoking rooms", "Air conditioning", "Accessible rooms",
      "Microwave", "Refrigerator in room", "Safe", "Private Bathrooms",
      "Sofa", "Sofa Bed", "Telephone", "Wardrobe / Closet"
    ],
    "Facilities": [
      "Pool", "Heated pool", "Indoor pool", "Outdoor pool", "Hot Tub",
      "Parking", "Free parking", "Wheelchair access", "ATM On Site",
      "Facilities for Disabled Guests", "Self-Serve Laundry"
    ],
    "Entertainment": [
      "Game Room", "Water Park", "Waterslide", "Kids pool",
      "Kids Activities", "Children's Television Networks"
    ],
    "Technology": [
      "Internet", "Free Internet", "Public Wifi", "Free Wifi", "Flatscreen TV"
    ],
    "Miscellaneous": [
      "Non-smoking hotel", "Housekeeping", "Outdoor Furniture", "Picnic Area",
      "BBQ Facilities", "Complimentary Toiletries", "24-Hour Front Desk",
      "Sun Loungers / Beach Chairs"
    ]
  };

  get sortedAmenityCategories(): string[] {
    return Object.keys(this.sortedAmenities);
  }

  ngOnInit(): void {
    // Fetch amenities from API and assign it to the amenities array
    this.amenities = [
      "Pool",
      "Free parking",
      "Hot Tub",
      "Internet",
      "Kids Activities",
      "Suites",
      "Free Internet",
      "Wheelchair access",
      "Public Wifi",
      "Free Wifi",
      "Non-smoking rooms",
      "Air conditioning",
      "Self-Serve Laundry",
      "Accessible rooms",
      "Microwave",
      "Refrigerator in room",
      "Non-smoking hotel",
      "Safe",
      "Heated pool",
      "Flatscreen TV",
      "Water Park",
      "Private Balcony",
      "Indoor pool",
      "Outdoor pool",
      "Parking",
      "Housekeeping",
      "ATM On Site",
      "Bath / Shower",
      "Coffee / Tea Maker",
      "English",
      "Fence Around Pool",
      "Free Private Parking Nearby",
      "Free Public Parking Nearby",
      "Complimentary Toiletries",
      "24-Hour Front Desk",
      "Game Room",
      "Gift Shop",
      "Hair Dryer",
      "Kids' Outdoor Play Equipment",
      "Outdoor Furniture",
      "Picnic Area",
      "Sun Loungers / Beach Chairs",
      "Wifi",
      "Family Rooms",
      "Kids pool",
      "Facilities for Disabled Guests",
      "BBQ Facilities",
      "Children's Television Networks",
      "Clothes Rack",
      "Iron",
      "Laptop Safe",
      "Pool / Beach Towels",
      "Private Bathrooms",
      "Seating Area",
      "Shallow End",
      "Sofa",
      "Sofa Bed",
      "Telephone",
      "Wardrobe / Closet",
      "Water Park Off-site",
      "Waterslide",
      "Whirlpool Bathtub"
    ];


    // Sort amenities into categories
    this.sortedAmenities = {};
    for (const [category, items] of Object.entries(this.categories)) {
      this.sortedAmenities[category] = this.amenities
        .filter(amenity => items.includes(amenity))
        .sort(); // Sort alphabetically within the category
    }

    // Add uncategorized amenities
    this.sortedAmenities["Other"] = this.amenities
      .filter(amenity => !Object.values(this.categories).flat().includes(amenity))
      .sort();

  }

  constructor() {
    this.encodedAddress = encodeURIComponent(this.hotelAddress);
    this.displayedRestaurants = this.nearbyRestaurants.slice(0, this.restaurantsToDisplay);
    this.displayedAttractions = this.nearbyAttractions.slice(0, this.attractionsToDisplay);
  }

}

interface Restaurants {
  nearbyRestaurantId: number;
  nearbyRestaurantName: string;
  nearbyRestaurantRating: number;
  nearbyRestaurantReviewCount: number;
  nearbyRestaurantDistance: number;
  nearbyRestaurantPriceRange: string;
  nearbyRestaurantFoodType: string;
}

interface Attractions {
  nearbyAttractionId: number;
  nearbyAttractionName: string;
  nearbyAttractionRating: number;
  nearbyAttractionReviewCount: number;
  nearbyAttractionDistance: number;
  nearbyAttractionType: string;
}
