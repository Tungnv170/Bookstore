using BookStore.DTOs;
using BookStore.Models;
using BookStore.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookRepository _bookRepository;

        public BooksController(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks(
            [FromQuery] string? search,
            [FromQuery] string? category)
        {
            var books = await _bookRepository.SearchBooksAsync(search, category);
            var bookDTOs = books.Select(b => new BookDTO
            {
                BookId = b.BookId,
                Title = b.Title,
                Author = b.Author,
                Category = b.Category,
                RetailPrice = b.RetailPrice,
                StockQuantity = b.StockQuantity
            });

            return Ok(bookDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDTO>> GetBook(int id)
        {
            var book = await _bookRepository.GetBookByIdAsync(id);
            if (book == null)
                return NotFound();

            var bookDTO = new BookDTO
            {
                BookId = book.BookId,
                Title = book.Title,
                Author = book.Author,
                Category = book.Category,
                RetailPrice = book.RetailPrice,
                StockQuantity = book.StockQuantity
            };

            return Ok(bookDTO);
        }

        [HttpPost]
        public async Task<ActionResult<BookDTO>> CreateBook(CreateBookDTO createBookDTO)
        {
            var book = new Book
            {
                Title = createBookDTO.Title,
                Author = createBookDTO.Author,
                Category = createBookDTO.Category,
                RetailPrice = createBookDTO.RetailPrice,
                StockQuantity = createBookDTO.StockQuantity
            };

            var createdBook = await _bookRepository.CreateBookAsync(book);

            var bookDTO = new BookDTO
            {
                BookId = createdBook.BookId,
                Title = createdBook.Title,
                Author = createdBook.Author,
                Category = createdBook.Category,
                RetailPrice = createdBook.RetailPrice,
                StockQuantity = createdBook.StockQuantity
            };

            return CreatedAtAction(nameof(GetBook), new { id = bookDTO.BookId }, bookDTO);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, UpdateBookDTO updateBookDTO)
        {
            var existingBook = await _bookRepository.GetBookByIdAsync(id);
            if (existingBook == null)
                return NotFound();

            existingBook.Title = updateBookDTO.Title;
            existingBook.Author = updateBookDTO.Author;
            existingBook.Category = updateBookDTO.Category;
            existingBook.RetailPrice = updateBookDTO.RetailPrice;
            existingBook.StockQuantity = updateBookDTO.StockQuantity;

            await _bookRepository.UpdateBookAsync(existingBook);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var result = await _bookRepository.DeleteBookAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPatch("{id}/stock")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] int quantity)
        {
            var result = await _bookRepository.UpdateStockAsync(id, quantity);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
