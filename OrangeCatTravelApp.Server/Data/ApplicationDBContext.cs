using Microsoft.EntityFrameworkCore;
using OrangeCatTravelApp.Entities;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Define DbSets for your entities
    public DbSet<User> Users { get; set; }
    public DbSet<Attraction> Attractions { get; set; }
    public DbSet<Hotel> Hotels { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<CustomReview> CustomReviews { get; set; }
    public DbSet<Wishlist> Wishlists { get; set; }
}