using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Models;
using API.Models.Data;
using API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IAuthRepository _authRepository;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    public AuthController(IAuthRepository authRepository, IConfiguration config, IMapper mapper)
    {
      _mapper = mapper;
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
      var loggedUser = _mapper.Map<UserForListDTO>(userRegistered);

      return Ok(new
      {
        token = tokenHandler.WriteToken(token),
        loggedUser
      });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserForRegisterDTO userForRegisterDTO)
    {
      userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();
      if (await _authRepository.UserExists(userForRegisterDTO.Username))
        return BadRequest("Username already exists");
      var userToCreate = _mapper.Map<User>(userForRegisterDTO);
      var createdUser = await _authRepository.Register(userToCreate, userForRegisterDTO.Password);
      var userToreturn = _mapper.Map<UserForDetailedDTO>(createdUser);
      return CreatedAtRoute(
        "GetUser", new { controller = "Users", id = createdUser.Id }, userToreturn);
    }
  }
}