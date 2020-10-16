using System.Threading.Tasks;
using DatingApp.API.Models;
using DatingApp.API.Models.Data;
using DatingApp.API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IAuthRepository _authRepository;
    public AuthController(IAuthRepository authRepository)
    {
      _authRepository = authRepository;
    }

    // [HttpPost("login")]
    // public async Task<IActionResult> Login()
    // {
    //     return StatusCode(200);
    // }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDTO userDTO)
    {
        // validate request
        if(!ModelState.IsValid) return BadRequest();

        userDTO.Username = userDTO.Username.ToLower();
        if (await _authRepository.UserExists(userDTO.Username))
            return BadRequest("Username already exists");
        var userToCreate = new User
        {
            Username = userDTO.Username
        };
        var createdUser = await _authRepository.Register(userToCreate, userDTO.Password);
        return Ok(createdUser);
    }
  }
}