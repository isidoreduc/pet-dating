using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.Models.Data;
using DatingApp.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
  [Authorize]
  [Route("api/users/{userId}/photos")]
  [ApiController]
  public class PhotosController : ControllerBase
  {
    private readonly IDatingRepository _datingRepo;
    private readonly IMapper _mapper;
    private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
    private readonly Cloudinary _cloudinary;

    public PhotosController(IDatingRepository datingRepo, IMapper mapper,
    IOptions<CloudinarySettings> cloudinaryConfig)
    {
      _cloudinaryConfig = cloudinaryConfig;
      _mapper = mapper;
      _datingRepo = datingRepo;

      Account account = new Account(_cloudinaryConfig.Value.CloudName,
        _cloudinaryConfig.Value.ApiKey, _cloudinaryConfig.Value.ApiSecret);

      _cloudinary = new Cloudinary(account);
    }

    [HttpGet("{id}", Name = "GetPhoto")]
    public async Task<IActionResult> GetPhoto(int id)
    {
      var photoFromRepo = await _datingRepo.GetPhoto(id);
      var photo = _mapper.Map<PhotoForReturnDTO>(photoFromRepo);
      return Ok(photo);
    }


    [HttpPost]
    public async Task<IActionResult> AddPhotoForUser(int userId,
      [FromForm] PhotoForCreationDTO photoForCreationDto)
    {
      if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        return Unauthorized();

      var userFromRepo = await _datingRepo.GetUserById(userId);
      var file = photoForCreationDto.File;

      var uploadResult = new ImageUploadResult();

      if (file.Length > 0)
      {
        using (var stream = file.OpenReadStream())
        {
          var uploadParams = new ImageUploadParams
          {
            File = new FileDescription(file.Name, stream),
            Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
          };

          uploadResult = _cloudinary.Upload(uploadParams);
        }
      }

      photoForCreationDto.Url = uploadResult.Url.ToString();
      photoForCreationDto.PublicId = uploadResult.PublicId;

      var photo = _mapper.Map<Photo>(photoForCreationDto);

      if (!userFromRepo.Photos.Any(u => u.IsMainPhoto))
        photo.IsMainPhoto = true;

      userFromRepo.Photos.Add(photo);

      if (await _datingRepo.SaveAll())
      {
        var photoToReturn = _mapper.Map<PhotoForReturnDTO>(photo);
        return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, photoToReturn);
      };

      return BadRequest("Could not add the photo");
    }

    [HttpPost("{photoId}/setMain")]
    public async Task<IActionResult> SetMainPhoto(int userId, int photoId)
    {
      // check the right user is trying to edit photo
      if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        return Unauthorized();
      // check that photo we want to set as main belongs to user's photos
      var user = await _datingRepo.GetUserById(userId);
      if (!user.Photos.Any(p => p.Id == photoId))
        return Unauthorized();

      var photoFromRepo = await _datingRepo.GetPhoto(photoId);
      if (photoFromRepo.IsMainPhoto)
        return BadRequest("This photo is your main photo already");
      var currentMainPhoto = await _datingRepo.GetMainPhotoForUser(userId);
      currentMainPhoto.IsMainPhoto = false;
      photoFromRepo.IsMainPhoto = true;
      if (await _datingRepo.SaveAll())
        return NoContent();
      return BadRequest("Could not set photo to main");
    }

    [HttpDelete("{photoId}")]
    public async Task<IActionResult> DeletePhoto(int userId, int photoId)
    {
      // check the right user is trying to edit photo
      if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        return Unauthorized();
      // check that photo we want to set as main belongs to user's photos
      var user = await _datingRepo.GetUserById(userId);
      if (!user.Photos.Any(p => p.Id == photoId))
        return Unauthorized();

      var photoFromRepo = await _datingRepo.GetPhoto(photoId);
      if (photoFromRepo.IsMainPhoto)
        return BadRequest("Cannot delete your main photo");
      // delete from cloudinary
      if (photoFromRepo.PublicId != null)
      {
        var result = _cloudinary.Destroy(new DeletionParams(photoFromRepo.PublicId));
        if (result.Result == "ok")
          _datingRepo.Delete(photoFromRepo);
      }
      else
      {
        _datingRepo.Delete(photoFromRepo);
      }
      if (await _datingRepo.SaveAll())
        return Ok();
      return BadRequest("Failed to delete photo");
    }
  }
}