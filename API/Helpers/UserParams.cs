namespace API.Helpers
{
  public class UserParams
  {
    private const int MaxPage = 50;
    public int PageNumber { get; set; } = 1;

    private int _pageSize = 10;
    public int PageSize
    {
      get => _pageSize;
      set => _pageSize = value > MaxPage ? MaxPage : value;
    }

    public int UserId { get; set; }
    public string Gender { get; set; }
    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 99;
    public string OrderBy { get; set; }
    public bool Likees { get; set; } = false;
    public bool Likers { get; set; } = false;

  }
}