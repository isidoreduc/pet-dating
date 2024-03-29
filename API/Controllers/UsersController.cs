using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using API.Models;
using API.Models.Data;
using API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using API.Helpers;
using Microsoft.AspNetCore.Cors;

namespace API.Controllers
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
      var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
      var userFromRepo = await _datingRepository.GetUserById(currentUserId);
      userParams.UserId = currentUserId;
      // if(string.IsNullOrEmpty(userParams.Gender))
      // {
      //   userParams.Gender = userFromRepo.Gender == "male" ? "female": "male";
      // }

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

    [HttpPost("{id}/like/{recipientId}")]
    public async Task<IActionResult> LikeUser(int id, int recipientId)
    {
      if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        return Unauthorized();
      var like = await _datingRepository.GetLike(id, recipientId);
      if(like != null)
        return BadRequest("You already liked this user");

      if(await _datingRepository.GetUserById(recipientId) == null)
        return NotFound();
      like = new Like
      {
        LikerId = id,
        LikeeId = recipientId
      };
      _datingRepository.Add<Like>(like);
      if(await _datingRepository.SaveAll())
        return Ok();

      return BadRequest("Failed to like user");
    }

    [HttpDelete("{id}/like/{recipientId}")]
    public async Task<IActionResult> UnlikeUser(int id, int recipientId)
    {
      if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        return Unauthorized();
      var unlike = await _datingRepository.GetLike(id, recipientId);
      if(unlike == null)
        return BadRequest("Cannot find a like on this user");

      if(await _datingRepository.GetUserById(recipientId) == null)
        return NotFound();

      _datingRepository.Delete<Like>(unlike);
      if(await _datingRepository.SaveAll())
        return Ok();

      return BadRequest("Failed to unlike user");
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