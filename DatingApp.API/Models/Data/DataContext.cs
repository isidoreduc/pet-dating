using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Models.Data
{
  public class DataContext : DbContext
  {
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }


    public DbSet<Value> Values { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      // Like entity is set to has a combination of LikerId and LikeeId as primary key,
      // because we want a Liker to only like a Likee exactly once.
      builder.Entity<Like>().HasKey(k => new { k.LikerId, k.LikeeId });
      // define many to many relationship: one likee can have multiple likers
      builder.Entity<Like>().HasOne(u => u.Likee)
        .WithMany(u => u.Likers)
        .HasForeignKey(u => u.LikeeId)
        .OnDelete(DeleteBehavior.Restrict);
      // and viceversa
      builder.Entity<Like>().HasOne(u => u.Liker)
        .WithMany(u => u.Likees)
        .HasForeignKey(u => u.LikerId)
        .OnDelete(DeleteBehavior.Restrict);

      builder.Entity<Message>().HasOne(u => u.Sender)
        .WithMany(u => u.MessagesSent)
        .OnDelete(DeleteBehavior.Restrict);
      builder.Entity<Message>().HasOne(u => u.Recepient)
        .WithMany(u => u.MessagesReceived)
        .OnDelete(DeleteBehavior.Restrict);

    }
  }
}