using System.Linq;
using DatingApp.API.Models.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class ValuesController : Controller
  {
    private readonly DataContext _ctx;
    public ValuesController(DataContext ctx)
    {
      _ctx = ctx;
    }

    [HttpGet]
    public IActionResult GetValues() => Ok(this._ctx.Values.ToList());
    
    [AllowAnonymous]
    [HttpGet("{id}")]
    public IActionResult GetValueById(int id) => Ok(this._ctx.Values.FirstOrDefault(e => e.Id == id));


  }
}