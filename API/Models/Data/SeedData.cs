using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Models.Data
{
  public class SeedData
  {
    private readonly DataContext _context;
    public SeedData(DataContext context)
    {
      _context = context;
    }

    public async Task SeedUsersAsync()
    {
      var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
      if (!_context.Users.Any())
      {
        // var userData = File.ReadAllText(path + @"Models\Data\UserSeedData.json");
        var userData = File.ReadAllText(@"Models\Data\UserSeedData.json");
        var users = JsonSerializer.Deserialize<IEnumerable<User>>(userData);
        foreach (var item in users)
        {
          byte[] passwordHash, passwordSalt;
          CreatePasswordHash("password", out passwordHash, out passwordSalt);
          item.PasswordHash = passwordHash;
          item.PasswordSalt = passwordSalt;
          item.Username = item.Username.ToLower();

          _context.Users.Add(item);
        }
        await _context.SaveChangesAsync();
      }
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
      // HMACSHA512 implements IDisposable, so anything executed in its scope will be dispose of after
      using var hmac = new HMACSHA512();
      passwordSalt = hmac.Key;
      passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    }

  }
}