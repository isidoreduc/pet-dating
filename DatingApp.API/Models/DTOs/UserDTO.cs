using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Models.DTOs
{
  public class UserDTO
  {
    [Required]
    [MinLength(4)]
    public string Username { get; set; }
    [Required]
    [StringLength(24, MinimumLength = 6, ErrorMessage = "Password must have at least 6 characters")]
    public string Password { get; set; }
  }
}