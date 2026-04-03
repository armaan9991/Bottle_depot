using MySqlConnector;
using Microsoft.AspNetCore.Mvc;
namespace BottleDepot.Models
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MySqlConnection _db;
        private readonly IConfiguration _config;
    

        public AuthController(MySqlConnection db,IConfiguration config){
           _db=db;
           _config= config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest req){
            try
            {
                await _db.OpenAsync();

                var qry= new MySqlCommand(@"
                    SELECT WorkID,Name,Email,Role
                    FROM EMPLOYEE
                    WHERE WorkID = @workId AND Password = @pass",_db
                    );

            qry.Parameters.AddWithValue("@workId", req.WorkID);
            qry.Parameters.AddWithValue("@pass", req.Password);

            var reader = await qry.ExecuteReaderAsync();
            if(!await reader.ReadAsync())
                {
                    return NotFound(new {message="Cant find any employee"});
                }
            var workId=reader.GetInt32("WorkId");
            var name= reader.GetString("Name");
            var role = reader.GetString("Role");
            var email= reader.GetString("Email");


            return Ok(new
            {
                workId,name,role,email
            });
            }
            catch (Exception e)
            {
                return StatusCode(404,new {message=e.Message});
            }
            finally
            {
                await _db.CloseAsync();
            }
        }
    }
}