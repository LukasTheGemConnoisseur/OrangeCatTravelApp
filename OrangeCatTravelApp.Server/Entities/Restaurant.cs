using System.ComponentModel.DataAnnotations;

namespace OrangeCatTravelApp.Entities
{
    public class Restaurant
    {
        [Key]
        public int RestaurantId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string TripAdvisorId { get; set; }
        public string? OpenAIId { get; set; }
        public decimal? total_price { get; set; }
        public ICollection<CustomReview> CustomReviews { get; set; } = new List<CustomReview>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}
