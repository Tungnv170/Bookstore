using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class Book
{
    public int BookId { get; set; }

    public string Title { get; set; } = null!;

    public string? Author { get; set; }

    public string? Category { get; set; }

    public decimal RetailPrice { get; set; }

    public int StockQuantity { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
