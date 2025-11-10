namespace BookStore.DTOs
{
    public class BookDTO
    {
        public int BookId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Author { get; set; }
        public string? Category { get; set; }
        public decimal RetailPrice { get; set; }
        public int StockQuantity { get; set; }
    }

    public class CreateBookDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Author { get; set; }
        public string? Category { get; set; }
        public decimal RetailPrice { get; set; }
        public int StockQuantity { get; set; }
    }

    public class UpdateBookDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Author { get; set; }
        public string? Category { get; set; }
        public decimal RetailPrice { get; set; }
        public int StockQuantity { get; set; }
    }
}
