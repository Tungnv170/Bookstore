namespace BookStore.DTOs
{
   public class OrderDTO
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Note { get; set; }
        public List<OrderDetailDTO> OrderDetails { get; set; } = new();
    }

    public class OrderDetailDTO
    {
        public int BookId { get; set; }
        public string BookTitle { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal SubTotal { get; set; }
    }

    public class CreateOrderDTO
    {
        public string? Note { get; set; }
        public List<CreateOrderDetailDTO> OrderDetails { get; set; } = new();
    }

    public class CreateOrderDetailDTO
    {
        public int BookId { get; set; }
        public int Quantity { get; set; }
    }
}
