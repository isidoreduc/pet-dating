using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Models.Data
{
  public class AuthRepository : IAuthRepository
  {
    private readonly DataContext _ctx;
    public AuthRepository(DataContext ctx)
    {
      _ctx = ctx;
    }

    public async Task<User> Login(string username, string password)
    {
      var user = await _ctx.Users.Include(u => u.Photos)
        .FirstOrDefaultAsync(x => x.Username == username);
      if (user == null) return null;
      if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)) return null;
      return user;
    }

    // based on the user salt and input password, recreates the password hash and compares it
    // byte by byte with the hash stored in db; if they match, login
    private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
      using var hmac = new HMACSHA512(passwordSalt);
      var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
      for (int i = 0; i < computedHash.Length; i++)
      {
        if (computedHash[i] != passwordHash[i]) return false;
      }
      return true;
    }

    public async Task<User> Register(User user, string password)
    {
      byte[] passwordHash, passwordSalt;
      // out marks a reference to the variable, so what is set as value in the CreatePassWordHash
      // is passed as reference to Register
      CreatePasswordHash(password, out passwordHash, out passwordSalt);
      user.PasswordHash = passwordHash;
      user.PasswordSalt = passwordSalt;

      await _ctx.Users.AddAsync(user);
      await _ctx.SaveChangesAsync();
      return user;
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
      // HMACSHA512 implements IDisposable, so anything executed in its scope will be dispose of after
      using var hmac = new HMACSHA512();
      passwordSalt = hmac.Key;
      passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
    }

    public async Task<bool> UserExists(string username)
    {
      return await _ctx.Users.FirstOrDefaultAsync(u => u.Username == username) != null;
    }
  }
}