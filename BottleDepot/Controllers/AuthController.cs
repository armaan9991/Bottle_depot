        using MySqlConnector;
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.IdentityModel.Tokens;
        using System.IdentityModel.Tokens.Jwt;
        using System.Security.Claims;
        using System.Text;
        using Microsoft.AspNetCore.Authorization;

        namespace BottleDepot.Models
        {
            [ApiController]
            [Route("api/auth")]
            public class AuthController : ControllerBase
            {
                private readonly MySqlConnection _db;
                private readonly IConfiguration _config;
        

                public AuthController(MySqlConnection db,IConfiguration config){
                _db=db;
                _config= config;
                }

                [HttpPost("test-token")]
                public IActionResult TestToken([FromBody] string token)
                {
                    try {
                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
                        var handler = new JwtSecurityTokenHandler();
                        handler.ValidateToken(token, new TokenValidationParameters {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = false,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = _config["Jwt:Issuer"],
                            ValidAudience = _config["Jwt:Audience"],
                            IssuerSigningKey = key
                        }, out _);
                        return Ok(new { valid = true });
                    } catch (Exception ex) {
                        return Ok(new { valid = false, error = ex.Message });
                    }
                }

                [HttpPost("login")]
                public async Task<IActionResult> Login([FromBody]LoginRequest req){
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
                    var workId=reader.GetInt32("WorkID");
                    var name= reader.GetString("Name");
                    var role = reader.GetString("Role");
                    var email= reader.GetString("Email");
                    // await qry.ExecuteReaderAsync();

                    var token = GenerateToken(workId,name,role);

                    return Ok(new
                    {   
                        workId,name,role,email,token
                    });
                    }
                    catch (Exception e)
                    {
                        return StatusCode(500,new {message=e.Message});
                    }
                    finally
                    {
                        await _db.CloseAsync();
                    }
                }
                private string GenerateToken(int workId, string name, string role)
            {
                var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    new Claim("workId", workId.ToString()),
                    new Claim("name",   name),
                    new Claim(ClaimTypes.Role,   role.ToLower())
                };

                    var token = new JwtSecurityToken(
                    issuer:             _config["Jwt:Issuer"],
                    audience:           _config["Jwt:Audience"],
                    claims:             claims,
                    notBefore:          DateTime.UtcNow,
                    expires:            DateTime.UtcNow.AddHours(1),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }

        [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            Name = User.Identity?.Name,
            Claims = User.Claims.Select(c => new {
                c.Type,
                c.Value
            })
        });
    }

    [HttpGet("time")]
public IActionResult GetTime() => Ok(new { 
    serverUtc = DateTime.UtcNow,
    unixTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
});
            }

        }