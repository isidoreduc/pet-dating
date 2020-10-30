using System.Collections.Generic;
using System.Threading.Tasks;

namespace DatingApp.API.Models.Data
{
  public interface IDatingRepository
  {
    void Add<T>(T entity) where T : class;
    void Delete<T>(T entity) where T : class;
    Task<bool> SaveAll();
    Task<IEnumerable<User>> GetUsers();
    Task<User> GetUserById(int id);
    Task<Photo> GetPhoto(int id);
    Task<Photo> GetMainPhotoForUser(int userId);

  }
}