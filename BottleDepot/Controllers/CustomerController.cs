using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.DTO;
using BottleDepot.Models;
using Microsoft.AspNetCore.Authorization;

/*here i have two endpoints
    To GETALL  Customers
    To Create  Customers
*/

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly MySqlConnection _db;
        public CustomerController(MySqlConnection db)
        {
            _db = db;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                await  _db.OpenAsync();

                var qry= new MySqlCommand(@"
                    SELECT CustomerID, Name, Email, Phone
                    FROM CUSTOMER
                    ORDER BY CustomerID",_db);

            var customers = new List<CustomerDTO>();

            var reader = await qry.ExecuteReaderAsync();
            while (await reader.ReadAsync())
                {
                    customers.Add(new CustomerDTO
{
    CustomerID = reader.GetInt32("CustomerID"),
    Name = reader.GetString("Name"),
    Email = reader.IsDBNull(reader.GetOrdinal("Email"))
        ? ""
        : reader.GetString("Email"),
    Phone = reader.IsDBNull(reader.GetOrdinal("Phone"))
        ? ""
        : reader.GetString("Phone")
});
                }    
              return Ok(customers);   
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
            finally
            {
                await _db.CloseAsync();
            }
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomerRequest req)
        {
            try
            {
                await _db.OpenAsync();
                
                var qry = new MySqlCommand(@"
                INSERT INTO CUSTOMER (Name, Email, Phone)
                VALUES (@name, @email, @phone)", _db);

                qry.Parameters.AddWithValue("@name",  req.Name);
                qry.Parameters.AddWithValue("@email", req.Email ?? (object)DBNull.Value);
                qry.Parameters.AddWithValue("@phone", req.Phone ?? (object)DBNull.Value);

                await qry.ExecuteNonQueryAsync();

                 var createdCustomer = new CustomerDTO
        {
            CustomerID = (int)qry.LastInsertedId,
            Name = req.Name,
            Email = req.Email,
            Phone = req.Phone
        };

        return Ok(createdCustomer);
            }
            catch (Exception e)
            {
                return StatusCode(500,new {message= e.Message});
            }
            finally
            {
                await _db.CloseAsync();
            }
        }
    }
}