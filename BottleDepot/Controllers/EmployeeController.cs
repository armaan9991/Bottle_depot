using BottleDepot.DTO;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("")]
    public class EmployeeController : ControllerBase
    {
        public readonly MySqlConnection _db;
        public EmployeeController(MySqlConnection db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                await _db.OpenAsync();

                var qry= new MySqlCommand(@"
                SELECT e.WorkID,
                        e.Name,
                        e.Email,
                        e.Phone,
                        e.Role,
                        e.WageRate,
                        e.DateOfHire,
                        e.SupervisorID,
                        s.Name AS SupervisorName
                FROM EMPLOYEE e
                LEFT JOIN EMPLOYEE s
                ON e.SupervisorID = s.WorkID",_db);
                
                var Emp = new List<EmployeeDTO>();

                var reader = await qry.ExecuteReaderAsync();
                // reader gets rows

                while ( await reader.ReadAsync())
                {
                    Emp.Add(new EmployeeDTO
                    {
                        WorkID = reader.GetInt32("WorkID"),
                        Name           = reader.GetString("Name"),
                        Email          = reader.GetString("Email"),
                        Phone          = reader.GetString("Phone"),
                        Role           = reader.GetString("Role"),
                        WageRate       = reader.GetDecimal("WageRate"),
                        DateOfHire     = reader.GetDateTime("DateOfHire"),
                        SupervisorID   = reader.IsDBNull(reader.GetOrdinal("SupervisorID"))
                                             ? null
                                             : reader.GetInt32("SupervisorID"),
                        SupervisorName = reader.IsDBNull(reader.GetOrdinal("SupervisorName"))
                                             ? null
                                             : reader.GetString("SupervisorName")
                    });
                }
                return Ok(Emp);
            }
            catch (Exception e)
            {
           return StatusCode(500, new { message = e.Message });
            }
            finally
            {
                await _db.CloseAsync();
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                await _db.OpenAsync();

                var qry = new MySqlCommand(@"
                SELECT
                        e.WorkID,
                        e.Name,
                        e.Email,
                        e.Phone,
                        e.Role,
                        e.WageRate,
                        e.DateOfHire,
                        e.SupervisorID,
                        s.Name AS SupervisorName
                    FROM EMPLOYEE e
                    LEFT JOIN EMPLOYEE s
                        ON e.SupervisorID = s.WorkID
                    WHERE e.WorkID = @id", _db);
                
                qry.Parameters.AddWithValue("@id",id);

                var reader = await qry.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                {
                    return NotFound(new{message="Employee not found!"});
                }

                var emp = new EmployeeDTO
                {
                    WorkID         = reader.GetInt32("WorkID"),
                    Name           = reader.GetString("Name"),
                    Email          = reader.GetString("Email"),
                    Phone          = reader.GetString("Phone"),
                    Role           = reader.GetString("Role"),
                    WageRate       = reader.GetDecimal("WageRate"),
                    DateOfHire     = reader.GetDateTime("DateOfHire"),
                    SupervisorID   = reader.IsDBNull(reader.GetOrdinal("SupervisorID"))
                                         ? null
                                         : reader.GetInt32("SupervisorID"),
                    SupervisorName = reader.IsDBNull(reader.GetOrdinal("SupervisorName"))
                                         ? null
                                         : reader.GetString("SupervisorName")
                };
                return Ok(emp);
            }
            catch (Exception e)
            {
                return StatusCode(500, new {message = e.Message});
            }
            finally
            {
                await _db.CloseAsync();
            }
        }
    
    }
}