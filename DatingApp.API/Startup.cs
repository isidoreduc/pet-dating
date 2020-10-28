using System;
using System.Net;
using System.Text;
using AutoMapper;
using DatingApp.API.Helpers;
using DatingApp.API.Models.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace DatingApp.API
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers();
      services.AddDbContext<DataContext>(options => options.UseSqlite(Configuration["ConnectionStrings:SqliteConnection"]));
      #region swagger config
      services.AddSwaggerGen(c =>
      {
        c.SchemaGeneratorOptions.CustomTypeMappings.Add(typeof(IFormFile), () => new OpenApiSchema() { Type = "file", Format = "binary" });
        c.SwaggerDoc("v1", new OpenApiInfo
        {
          Title = "PetDating API",
          Version = "v1",
          Description = "Api for an useless, but hype pet dating site",
          Contact = new OpenApiContact
          {
            Name = "AR",
            Email = string.Empty,
            Url = new Uri("https://zmaf.dk/"),
          }
        });
        var securitySchema = new OpenApiSecurityScheme
        {
          Description = "JWT Auth Bearer Scheme",
          Name = "Authorization",
          In = ParameterLocation.Header,
          Type = SecuritySchemeType.Http,
          Scheme = "bearer",
          Reference = new OpenApiReference
          {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
          }
        };
        c.AddSecurityDefinition("Bearer", securitySchema);
        var securityRequirement = new OpenApiSecurityRequirement { { securitySchema, new[] { "Bearer" } } };
        c.AddSecurityRequirement(securityRequirement);
      });

      #endregion
      services.AddCors();
      services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
      services.AddScoped<IAuthRepository, AuthRepository>();
      services.AddScoped<IDatingRepository, DatingRepository>();
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
      {
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(
            Configuration["Tokens:JwToken"])),
          ValidateIssuer = false,
          ValidateAudience = false
        };
      });
      services.AddTransient<SeedData>();
      services.AddAutoMapper(typeof(Startup));

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, SeedData seeder)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler(builder =>
        {
          builder.Run(async context =>
          {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            var error = context.Features.Get<IExceptionHandlerFeature>();
            if (error != null)
            {
              context.Response.AddApplicationError(error.Error.Message);
              await context.Response.WriteAsync(error.Error.Message);
            }
          });
        });
      }
      seeder.SeedUsers();

      app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
      app.UseHttpsRedirection();

      app.UseRouting();
      // authentication always before authorization in the pipeline
      app.UseAuthentication();
      app.UseAuthorization();
      // Enable middleware to serve generated Swagger as a JSON endpoint.
      app.UseSwagger();

      // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
      // specifying the Swagger JSON endpoint.
      app.UseSwaggerUI(c =>
      {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Useless API V1");

        // To serve SwaggerUI at application's root page, set the RoutePrefix property to an empty string.
        c.RoutePrefix = string.Empty;
      });

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
