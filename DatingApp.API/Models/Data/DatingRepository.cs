using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Models.Data
{
  public class DatingRepository : IDatingRepository
  {
    private readonly DataContext _ctx;
    public DatingRepository(DataContext ctx)
    {
      _ctx = ctx;
    }

    // not async because it is stored in memory until we actually SaveAll to database
    public void Add<T>(T entity) where T : class
    {
      _ctx.Add(entity);
    }

    public void Delete<T>(T entity) where T : class
    {
      _ctx.Remove(entity);
    }

    public async Task<Like> GetLike(int userId, int recipientId)
    {
      return await _ctx.Likes
        .FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
    }

    public async Task<Photo> GetMainPhotoForUser(int userId)
    {
      return await _ctx.Photos.Where(u => u.UserId == userId)
        .FirstOrDefaultAsync(p => p.IsMainPhoto);
    }

    public async Task<Photo> GetPhoto(int id)
    {
      return await _ctx.Photos.FirstOrDefaultAsync(p => p.Id == id);
    }

    // async - there is a wire connection call to database
    public async Task<User> GetUserById(int id)
    {
      return await _ctx.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
    }

    // async - there is a wire connection call to database
    public async Task<PagedList<User>> GetUsers(UserParams userParams)
    {
      var users = _ctx.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive)
        .AsQueryable();
      // filter out the logged in user
      users = users.Where(u => u.Id != userParams.UserId);

      // gender filtering
      if(userParams.Gender != null)
        users = users.Where(u => u.Gender == userParams.Gender);

      // age filtering
      if(userParams.MinAge !=18 || userParams.MaxAge != 99)
      {
        var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
        var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
        users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
      }

      // order by date created or date last active
      if(userParams.OrderBy != null)
      {
        switch (userParams.OrderBy)
        {
          case "created":
            users = users.OrderByDescending(u => u.Created);
            break;
          default:
            users = users.OrderByDescending(u => u.LastActive);
            break;
        }
      }



      return await PagedList<User>
        .CreateAsync(users, userParams.PageNumber, userParams.PageSize);
    }

    public async Task<bool> SaveAll()
    {
      return await _ctx.SaveChangesAsync() > 0;
    }
  }
}