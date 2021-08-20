using System.IO;
using System.Threading.Tasks;
using API.Models.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
  public class Program
  {
    // public static void Main(string[] args)
    // {
    //   CreateHostBuilder(args).Build().Run();
    // }

    // public static IHostBuilder CreateHostBuilder(string[] args) =>
    //     Host.CreateDefaultBuilder(args)
    //         .ConfigureWebHostDefaults(webBuilder =>
    //         {
    //           webBuilder
    //           .UseStartup<Startup>();
    //         });

    public static async Task Main(string[] args)
    {
      var host = CreateHostBuilder(args).Build();
      using (var scope = host.Services.CreateScope())
      {
        var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
        var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
        var seeder = scope.ServiceProvider.GetRequiredService<SeedData>();
        try
        {
          await dataContext.Database.MigrateAsync();
          await seeder.SeedUsersAsync();
        }
        catch (System.Exception ex)
        {
          var logger = loggerFactory.CreateLogger<Program>();
          logger.LogError(ex, "Error at startup migration");
        }
      }
      host.Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder.UseStartup<Startup>();
            });
  }
}
