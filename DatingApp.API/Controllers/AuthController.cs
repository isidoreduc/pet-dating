using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Models;
using DatingApp.API.Models.Data;
using DatingApp.API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace DatingApp.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IAuthRepository _authRepository;
    private readonly IConfiguration _config;
    public AuthController(IAuthRepository authRepository, IConfiguration config)
    {
      _config = config;
      _authRepository = authRepository;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserDTOForAuth userDTOForAuth)
    {
      var userRegistered = await _authRepository.Login(userDTOForAuth.Username.ToLower(), userDTOForAuth.Password);
      if (userRegistered == null) return Unauthorized();

      // jwtoken creation: we need some identification info(id, name)
      var claims = new[]
      {
            new Claim(ClaimTypes.NameIdentifier, userRegistered.Id.ToString()),
            new Claim(ClaimTypes.Name, userRegistered.Username)
        };

      // also need a key to create signing credentials
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:JwToken"]));
      // derive signing credentials
      var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = credentials
      };
      // token builder
      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescriptor);

      return Ok(new { token = tokenHandler.WriteToken(token) });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDTOForAuth userDTOForAuth)
    {
      // validate request
      if (!ModelState.IsValid) return BadRequest();

      userDTOForAuth.Username = userDTOForAuth.Username.ToLower();
      if (await _authRepository.UserExists(userDTOForAuth.Username))
        return BadRequest("Username already exists");
      var userToCreate = new User
      {
        Username = userDTOForAuth.Username
      };
      var createdUser = await _authRepository.Register(userToCreate, userDTOForAuth.Password);
      return Ok(createdUser);
    }
  }
}