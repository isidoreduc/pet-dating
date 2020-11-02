using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Models.DTOs
{
  public class UserForRegisterDTO
  {
    [Required]
    [MinLength(3)]
    public string Username { get; set; }
    [Required]
    [StringLength(24, MinimumLength = 6, ErrorMessage = "Password must have at least 6 characters")]
    public string Password { get; set; }
    [Required]
    public string Gender { get; set; }
    [Required]
    public string KnownAs { get; set; }
    [Required]
    public string City { get; set; }
    [Required]
    public string Country { get; set; }
    [Required]
    public DateTime Dob { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }

    public UserForRegisterDTO()
    {
      Created = DateTime.Now;
      LastActive = DateTime.Now;
    }

  }
}