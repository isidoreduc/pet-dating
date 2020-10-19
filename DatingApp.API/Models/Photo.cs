using System;

namespace DatingApp.API.Models
{
  public class Photo
  {
    public int Id { get; set; }
    public string Url { get; set; }
    public string Description { get; set; }
    public DateTime DateAdded { get; set; }
    public bool IsMainPhoto { get; set; }

// without these 2 props, EF creates a default relationship, but does not cascade delete on user
// removal. photos stay
    public User User { get; set; }
    public int UserId { get; set; }
  }
}