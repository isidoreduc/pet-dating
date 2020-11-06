using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Models;
using DatingApp.API.Models.Data;
using DatingApp.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using DatingApp.API.Helpers;

namespace DatingApp.API.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  [ServiceFilter(typeof(LogUserActivity))]
  public class UsersController : ControllerBase
  {
    private readonly IDatingRepository _datingRepository;
    private readonly IMapper _mapper;
    public UsersController(IDatingRepository datingRepository, IMapper mapper)
    {
      _mapper = mapper;
      _datingRepository = datingRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
    {
      var users = await _datingRepository.GetUsers(userParams);
      var mappedUsers = _mapper.Map<IEnumerable<UserForListDTO>>(users);
      Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
      return Ok(mappedUsers);
    }

    [HttpGet("{id}", Name = "GetUser")]
    public async Task<IActionResult> GetUser(int id)
    {
      return Ok(_mapper.Map<UserForDetailedDTO>(await _datingRepository.GetUserById(id)));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UserForUpdateDTO userForUpdateDTO)
    {
      // if the id of user to update does not match the current user's id encrypted in the token,
      // it means he should not be able to update other user's profile
      if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        return Unauthorized();
      var userToUpdate = await _datingRepository.GetUserById(id);
      _mapper.Map(userForUpdateDTO, userToUpdate);
      if (await _datingRepository.SaveAll())
        return NoContent();
      throw new Exception("Updating user failed on save");
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