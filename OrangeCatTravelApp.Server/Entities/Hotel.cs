using System.ComponentModel.DataAnnotations;

namespace OrangeCatTravelApp.Entities
{
    public class Hotel
    {
        [Key]
        public int HotelId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string TripAdvisorId { get; set; }
        public string? OpenAIId { get; set; }
        public int NumberOfGuests { get; set; }
        public int NumberOfAdults { get; set; }
        public int NumberOfChildren { get; set; }
        public decimal? total_price { get; set; }
        public ICollection<CustomReview> CustomReviews { get; set; } = new List<CustomReview>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}
