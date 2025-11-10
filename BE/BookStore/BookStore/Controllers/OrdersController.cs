using BookStore.DTOs;
using BookStore.Models;
using BookStore.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IBookRepository _bookRepository;

        public OrdersController(IOrderRepository orderRepository, IBookRepository bookRepository)
        {
            _orderRepository = orderRepository;
            _bookRepository = bookRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();
            var orderDTOs = orders.Select(o => new OrderDTO
            {
                OrderId = o.OrderId,
                OrderDate = (DateTime)o.OrderDate,
                TotalAmount = o.TotalAmount,
                Note = o.Note,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetailDTO
                {
                    BookId = od.BookId,
                    BookTitle = od.Book.Title,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    SubTotal = od.Quantity * od.UnitPrice
                }).ToList()
            });

            return Ok(orderDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            var order = await _orderRepository.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound();

            var orderDTO = new OrderDTO
            {
                OrderId = order.OrderId,
                OrderDate = (DateTime)order.OrderDate,
                TotalAmount = order.TotalAmount,
                Note = order.Note,
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailDTO
                {
                    BookId = od.BookId,
                    BookTitle = od.Book.Title,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    SubTotal = od.Quantity * od.UnitPrice
                }).ToList()
            };

            return Ok(orderDTO);
        }

        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder(CreateOrderDTO createOrderDTO)
        {
            // Validate stock
            foreach (var item in createOrderDTO.OrderDetails)
            {
                var book = await _bookRepository.GetBookByIdAsync(item.BookId);
                if (book == null)
                    return BadRequest($"Book with ID {item.BookId} not found");

                if (book.StockQuantity < item.Quantity)
                    return BadRequest($"Not enough stock for book: {book.Title}");
            }

            // Create order
            var order = new Order
            {
                Note = createOrderDTO.Note,
                OrderDetails = new List<OrderDetail>()
            };

            decimal totalAmount = 0;
            foreach (var item in createOrderDTO.OrderDetails)
            {
                var book = await _bookRepository.GetBookByIdAsync(item.BookId);
                var orderDetail = new OrderDetail
                {
                    BookId = item.BookId,
                    Quantity = item.Quantity,
                    UnitPrice = book!.RetailPrice
                };

                order.OrderDetails.Add(orderDetail);
                totalAmount += orderDetail.Quantity * orderDetail.UnitPrice;
            }

            order.TotalAmount = totalAmount;

            var createdOrder = await _orderRepository.CreateOrderAsync(order);

            // Reload to get book details
            createdOrder = await _orderRepository.GetOrderByIdAsync(createdOrder.OrderId);

            var orderDTO = new OrderDTO
            {
                OrderId = createdOrder!.OrderId,
                OrderDate = (DateTime)createdOrder.OrderDate,
                TotalAmount = createdOrder.TotalAmount,
                Note = createdOrder.Note,
                OrderDetails = createdOrder.OrderDetails.Select(od => new OrderDetailDTO
                {
                    BookId = od.BookId,
                    BookTitle = od.Book.Title,
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    SubTotal = od.Quantity * od.UnitPrice
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = orderDTO.OrderId }, orderDTO);
        }
    }
}
