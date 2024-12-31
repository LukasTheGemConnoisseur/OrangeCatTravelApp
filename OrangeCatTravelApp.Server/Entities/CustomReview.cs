using System.ComponentModel.DataAnnotations;

namespace OrangeCatTravelApp.Entities
{
    public class CustomReview
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } // Navigation property for User

        public int? HotelId { get; set; }
        public Hotel Hotel { get; set; } // Navigation property for Hotel

        public int? RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; } // Navigation property for Restaurant

        public int? AttractionId { get; set; }
        public Attraction Attraction { get; set; } // Navigation property for Attraction

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; } // Rating from 1 to 5

        [Required]
        public string ReviewText { get; set; } // Text of the review

        [Required]
        public DateTime ReviewDate { get; set; }
    }
}
