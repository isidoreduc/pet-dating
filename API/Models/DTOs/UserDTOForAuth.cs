using System.ComponentModel.DataAnnotations;

namespace API.Models.DTOs
{
  public class UserDTOForAuth
  {
    [Required]
    [MinLength(3)]
    public string Username { get; set; }
    [Required]
    [StringLength(24, MinimumLength = 6, ErrorMessage = "Password must have at least 6 characters")]
    public string Password { get; set; }
  }
}