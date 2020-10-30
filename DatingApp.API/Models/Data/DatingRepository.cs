using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public async Task<IEnumerable<User>> GetUsers()
    {
      return await _ctx.Users.Include(p => p.Photos).ToListAsync();
    }

    public async Task<bool> SaveAll()
    {
      return await _ctx.SaveChangesAsync() > 0;
    }
  }
}