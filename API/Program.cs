using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace API
{
  public class Program
  {
    public static void Main(string[] args)
    {
      CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder
              // .UseKestrel()
              // .UseContentRoot(Directory.GetCurrentDirectory())
              // .UseUrls("http://localhost:5100", "http://localhost:5101", "http://*:5102")
              // .UseIISIntegration()
              .UseStartup<Startup>();
            });


  }
}
