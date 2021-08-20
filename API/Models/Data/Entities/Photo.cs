using System;
using System.Text.Json.Serialization;

namespace API.Models
{
  public class Photo
  {
    public int Id { get; set; }
    public string Url { get; set; }
    public string Description { get; set; }
    public DateTime DateAdded { get; set; }
    public bool IsMainPhoto { get; set; }
    public string PublicId { get; set; }

    // without these 2 props, EF creates a default relationship, but does not cascade delete on user
    // removal. photos stay
    [JsonIgnore] // to avoid reference loop
    public User User { get; set; }
    public int UserId { get; set; }
  }
}