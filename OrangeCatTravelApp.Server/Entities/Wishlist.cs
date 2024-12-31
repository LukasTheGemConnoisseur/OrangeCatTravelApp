using System.ComponentModel.DataAnnotations;

namespace OrangeCatTravelApp.Entities
{
    public class Wishlist
    {
        [Key]
        public int WishlistId { get; set; }

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
        public DateTime AddedDate { get; set; }
    }
}
