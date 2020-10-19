using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
  public static class Extensions
  {
    // extension method - extends HttpResponse type
    public static void AddApplicationError(this HttpResponse response, string message)
    {
      response.Headers.Add("Application-Error", message);
      // allow displaying the application-error headers
      response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
      // allow CORS, so we can display application-error in client
      response.Headers.Add("Access-Control-Allow-Origin", "*");
    }

    public static int CalculateAge(this DateTime dob)
    {
      var age = DateTime.Now.Year - dob.Year;
      if (dob.AddYears(age) > DateTime.Now) age--;
      return age;
    }
  }
}