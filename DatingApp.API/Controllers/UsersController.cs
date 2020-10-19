using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Models;
using DatingApp.API.Models.Data;
using DatingApp.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class UsersController : ControllerBase
  {
    private readonly IDatingRepository _datingRepository;
    private readonly IMapper _mapper;
    public UsersController(IDatingRepository datingRepository, IMapper mapper)
    {
      _mapper = mapper;
      _datingRepository = datingRepository;
    }

    [HttpGet()]
    public async Task<IActionResult> GetUsers()
    {
      return Ok(_mapper.Map<IEnumerable<UserForListDTO>>(await _datingRepository.GetUsers()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
      return Ok(_mapper.Map<UserForDetailedDTO>(await _datingRepository.GetUserById(id)));
    }

    [HttpPost]
    public void AddUser(User user)
    {
      _datingRepository.Add(user);
      _datingRepository.SaveAll();
    }

    [HttpDelete]
    public void DeleteUser(User user)
    {
      _datingRepository.Delete(user);
      _datingRepository.SaveAll();
    }
  }
}