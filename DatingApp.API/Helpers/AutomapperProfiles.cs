using System;
using System.Linq;
using AutoMapper;
using DatingApp.API.Models;
using DatingApp.API.Models.DTOs;

namespace DatingApp.API.Helpers
{
  public class AutomapperProfiles : Profile
  {
    public AutomapperProfiles()
    {
      CreateMap<User, UserForListDTO>()
        .ForMember(userForList => userForList.Age, cfg => cfg.MapFrom(
            user => user.DateOfBirth.CalculateAge()))
        .ForMember(userForList => userForList.PhotoUrl, cfg => cfg.MapFrom(
            user => user.Photos.FirstOrDefault(p => p.IsMainPhoto).Url));

      CreateMap<User, UserForDetailedDTO>()
        .ForMember(userForDetailedList => userForDetailedList.Age, cfg => cfg.MapFrom(
            user => user.DateOfBirth.CalculateAge()))
        .ForMember(userForList => userForList.PhotoUrl, cfg => cfg.MapFrom(
            user => user.Photos.FirstOrDefault(p => p.IsMainPhoto).Url));
      // we use it in a httppost, so we go from DTO to user (data comes from client -> DTO -> User -> server)
      // in httpget, data comes from server -> User -> DTO -> client
      CreateMap<UserForUpdateDTO, User>();
      CreateMap<Photo, PhotoForReturnDTO>();
      CreateMap<PhotoForCreationDTO, Photo>();
    }
  }
}