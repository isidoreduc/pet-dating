namespace API.Helpers
{
    public class MessageParams
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
        public string MessageContainer { get; set; } = "Unread";
    }
}