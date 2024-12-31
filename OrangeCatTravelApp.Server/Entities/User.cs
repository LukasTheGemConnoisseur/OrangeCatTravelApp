using System.ComponentModel.DataAnnotations;

namespace OrangeCatTravelApp.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Password { get; set; }

        public string? Description { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? CommunicationPreference { get; set; }

        public string? ProfilePictureUrl { get; set; }

        public ICollection<CustomReview> CustomReviews { get; set; } = new List<CustomReview>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}