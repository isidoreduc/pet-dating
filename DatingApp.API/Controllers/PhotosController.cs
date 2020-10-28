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
    public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDTO photoForCreationDTO)
    {
      if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
        return Unauthorized();
      var userFromRepo = await _datingRepo.GetUserById(userId);
      var file = photoForCreationDTO.File;
      var uploadResult = new ImageUploadResult();
      if (file.Length > 0)
      {
        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams()
        {
          File = new FileDescription(file.Name, stream),
          Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
        };
        uploadResult = _cloudinary.Upload(uploadParams);
      }
      photoForCreationDTO.Url = uploadResult.Url.ToString();
      photoForCreationDTO.PublicId = uploadResult.PublicId;

      var photo = _mapper.Map<Photo>(photoForCreationDTO);
      if (!userFromRepo.Photos.Any(u => u.IsMainPhoto))
        photo.IsMainPhoto = true;

      userFromRepo.Photos.Add(photo);

      if (await _datingRepo.SaveAll())
      {
        var photoToReturn = _mapper.Map<PhotoForReturnDTO>(photo);
        return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
      }
      return BadRequest("Could not add the photo");
    }
  }
}