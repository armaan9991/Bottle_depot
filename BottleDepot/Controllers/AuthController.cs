using Microsoft.AspNetCore.Mvc;

namespace BottleDepot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            //MOCK DATA: This is a temporary check for testing.
            // Later,will query your Employee/Customer database tables here.

            if (request.WorkId == "admin" && request.Password == "admin123")
            {
                // Returns a 200 OK with the JSON data your frontend is expecting
                return Ok(new 
                { 
                    Name = "System Admin", 
                    Role = "Admin", 
                    WorkId = request.WorkId 
                });
            }
            
            if (request.WorkId == "employee" && request.Password == "emp123")
            {
                return Ok(new 
                { 
                    Name = "Jane Doe", 
                    Role = "Employee", 
                    WorkId = request.WorkId 
                });
            }

            // Returns a 401 Unauthorized if the credentials don't match
            return Unauthorized("Invalid Work ID or Password");
        }
    }

    // A simple class to represent the incoming JSON data from React
    public class LoginRequest
    {
        public string? WorkId { get; set; }
        public string? Password { get; set; }
    }
}