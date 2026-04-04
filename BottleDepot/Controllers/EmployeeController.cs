using BottleDepot.DTO;
using Microsoft.AspNetCore.Mvc;
using BottleDepot.Models;
using MySqlConnector;
using Microsoft.AspNetCore.Authorization;

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        public readonly MySqlConnection _db;
        public EmployeeController(MySqlConnection db)
        {
            _db = db;
        }
        [Authorize]
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

        [Authorize]
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
        [Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeRequest req)
        {
            try
            {
                await _db.OpenAsync();

                var qry = new MySqlCommand(@"
                INSERT INTO EMPLOYEE
                 (Name, Email, Phone, Role,WageRate, DateOfHire, Password, SupervisorID)
                VALUES
                 (@name, @email, @phone, @role,@wage, @date, @password, @supervisorId)", _db);

                qry.Parameters.AddWithValue("@name", req.Name);
                qry.Parameters.AddWithValue("@email", req.Email);
                qry.Parameters.AddWithValue("@phone", req.Phone);
                qry.Parameters.AddWithValue("@role", req.Role);
                qry.Parameters.AddWithValue("@wage", req.WageRate);
                qry.Parameters.AddWithValue("@date", req.DateOfHire);
                qry.Parameters.AddWithValue("@password", req.Password);
                qry.Parameters.AddWithValue("@supervisorId",req.SupervisorID.HasValue
                                                                ? req.SupervisorID
                                                                :DBNull.Value);

                await qry.ExecuteNonQueryAsync();

                return Ok(new {message= "Employee created!!"});

            }
            catch(Exception e)
            {
                return StatusCode(500, new { message=e.Message});
            }
            finally
            {
                await _db.CloseAsync();
            }
        }
        
        [Authorize(Roles ="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,CreateEmployeeRequest req)
        {
            try
            {
                await _db.OpenAsync();

                var qry = new MySqlCommand(@"
                    UPDATE EMPLOYEE
                    SET
                        Name         = @name,
                        Email        = @email,
                        Phone        = @phone,
                        Role         = @role,
                        WageRate     = @wage,
                        SupervisorID = @supervisorId
                    WHERE WorkID = @id", _db);

                qry.Parameters.AddWithValue("@name",         req.Name);
                qry.Parameters.AddWithValue("@email",        req.Email);
                qry.Parameters.AddWithValue("@phone",        req.Phone);
                qry.Parameters.AddWithValue("@role",         req.Role);
                qry.Parameters.AddWithValue("@wage",         req.WageRate);
                qry.Parameters.AddWithValue("@supervisorId", req.SupervisorID.HasValue
                                                                 ? req.SupervisorID
                                                                 : DBNull.Value);
                qry.Parameters.AddWithValue("@id",           id);

                var rows = await qry.ExecuteNonQueryAsync();

                if (rows == 0)
                    return NotFound(new { message = "Employee not found" });

                return Ok(new { message = "Employee updated !!" });
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
    }
}