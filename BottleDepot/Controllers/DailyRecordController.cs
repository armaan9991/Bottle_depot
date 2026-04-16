using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.DTO;
using Microsoft.AspNetCore.Authorization;

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DailyRecordController : ControllerBase
    {
        private readonly MySqlConnection _db;

        public DailyRecordController(MySqlConnection db)
        {
            _db = db;
        }

        [Authorize(Roles ="Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    SELECT
                        dr.RecordID, dr.TotalTransaction, dr.TotalValuePaid,
                        dr.TotalContainer, dr.TotalShipments, dr.RecordDate,
                        dr.Status, dr.WorkID, e.Name AS EmployeeName
                    FROM DAILY_RECORD dr
                    JOIN EMPLOYEE e ON dr.WorkID = e.WorkID
                    ORDER BY dr.RecordDate DESC", _db);

                var records  = new List<DailyRecordDTO>();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    records.Add(new DailyRecordDTO
                    {
                        RecordID          = reader.GetInt32("RecordID"),
                        TotalTransactions = reader.GetInt32("TotalTransaction"),
                        TotalValuePaidOut = reader.GetDecimal("TotalValuePaid"),
                        TotalContainers   = reader.GetInt32("TotalContainer"),
                        TotalShipments    = reader.GetInt32("TotalShipments"),
                        RecordDate        = reader.GetDateTime("RecordDate"),
                        Status            = reader.GetString("Status"),
                        WorkID            = reader.GetInt32("WorkID"),
                        EmployeeName      = reader.GetString("EmployeeName")
                    });
                }

                return Ok(records);
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
        [HttpGet("today")]
        public async Task<IActionResult> GetToday()
        {
            try
            {
                await _db.OpenAsync();

                // 1. Try to find a record for today
                var cmd = new MySqlCommand(@"
                    SELECT
                        dr.RecordID, dr.TotalTransaction, dr.TotalValuePaid,
                        dr.TotalContainer, dr.TotalShipments, dr.RecordDate,
                        dr.Status, dr.WorkID, e.Name AS EmployeeName
                    FROM DAILY_RECORD dr
                    JOIN EMPLOYEE e ON dr.WorkID = e.WorkID
                    WHERE DATE(dr.RecordDate) = CURDATE()
                    ORDER BY dr.RecordID DESC LIMIT 1", _db);

                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    var record = new DailyRecordDTO
                    {
                        RecordID          = reader.GetInt32("RecordID"),
                        TotalTransactions = reader.GetInt32("TotalTransaction"),
                        TotalValuePaidOut = reader.GetDecimal("TotalValuePaid"),
                        TotalContainers   = reader.GetInt32("TotalContainer"),
                        TotalShipments    = reader.GetInt32("TotalShipments"),
                        RecordDate        = reader.GetDateTime("RecordDate"),
                        Status            = reader.GetString("Status"),
                        WorkID            = reader.GetInt32("WorkID"),
                        EmployeeName      = reader.GetString("EmployeeName")
                    };
                    return Ok(record);
                }
                
                // 2. If NO record exists for today, we close the reader and create one dynamically!
                await reader.CloseAsync();

                // Grab the currently logged in user's ID from their JWT token
                var workIdClaim = User.Claims.FirstOrDefault(c => c.Type == "workId")?.Value;
                int currentWorkId = workIdClaim != null ? int.Parse(workIdClaim) : 1;

                var insertCmd = new MySqlCommand(@"
                    INSERT INTO DAILY_RECORD 
                        (TotalTransaction, TotalValuePaid, TotalContainer, TotalShipments, RecordDate, Status, WorkID)
                    VALUES 
                        (0, 0.00, 0, 0, CURDATE(), 'Open', @workId);
                    SELECT LAST_INSERT_ID();", _db);
                
                insertCmd.Parameters.AddWithValue("@workId", currentWorkId);
                
                var newIdResult = await insertCmd.ExecuteScalarAsync();
                int newRecordId = Convert.ToInt32(newIdResult);

                var empCmd = new MySqlCommand("SELECT Name FROM EMPLOYEE WHERE WorkID = @workId", _db);
                empCmd.Parameters.AddWithValue("@workId", currentWorkId);
                string empName = (await empCmd.ExecuteScalarAsync())?.ToString() ?? "Unknown";

                var newRecord = new DailyRecordDTO
                {
                    RecordID          = newRecordId,
                    TotalTransactions = 0,
                    TotalValuePaidOut = 0,
                    TotalContainers   = 0,
                    TotalShipments    = 0,
                    RecordDate        = DateTime.Now,
                    Status            = "Open",
                    WorkID            = currentWorkId,
                    EmployeeName      = empName
                };

                return Ok(newRecord);
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
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    try
    {
        await _db.OpenAsync();

        var cmd = new MySqlCommand(@"
            SELECT
                dr.RecordID, dr.TotalTransaction, dr.TotalValuePaid,
                dr.TotalContainer, dr.TotalShipments, dr.RecordDate,
                dr.Status, dr.WorkID, e.Name AS EmployeeName
            FROM DAILY_RECORD dr
            JOIN EMPLOYEE e ON dr.WorkID = e.WorkID
            WHERE dr.RecordID = @id", _db);

        cmd.Parameters.AddWithValue("@id", id);

        using var reader = await cmd.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return NotFound(new { message = "Record not found" });

        return Ok(new DailyRecordDTO
        {
            RecordID = reader.GetInt32("RecordID"),
            TotalTransactions = reader.GetInt32("TotalTransaction"),
            TotalValuePaidOut = reader.GetDecimal("TotalValuePaid"),
            TotalContainers = reader.GetInt32("TotalContainer"),
            TotalShipments = reader.GetInt32("TotalShipments"),
            RecordDate = reader.GetDateTime("RecordDate"),
            Status = reader.GetString("Status"),
            WorkID = reader.GetInt32("WorkID"),
            EmployeeName = reader.GetString("EmployeeName")
        });
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
[HttpGet("date/{date}")]
public async Task<IActionResult> GetByDate(string date)
{
    try
    {
        await _db.OpenAsync();

        var cmd = new MySqlCommand(@"
            SELECT
                dr.RecordID, dr.TotalTransaction, dr.TotalValuePaid,
                dr.TotalContainer, dr.TotalShipments, dr.RecordDate,
                dr.Status, dr.WorkID, e.Name AS EmployeeName
            FROM DAILY_RECORD dr
            JOIN EMPLOYEE e ON dr.WorkID = e.WorkID
            WHERE DATE(dr.RecordDate) = @date
            LIMIT 1", _db);

        cmd.Parameters.AddWithValue("@date", date);

        using var reader = await cmd.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
            return NotFound(new { message = "No record for selected date" });

        return Ok(new DailyRecordDTO
        {
            RecordID = reader.GetInt32("RecordID"),
            TotalTransactions = reader.GetInt32("TotalTransaction"),
            TotalValuePaidOut = reader.GetDecimal("TotalValuePaid"),
            TotalContainers = reader.GetInt32("TotalContainer"),
            TotalShipments = reader.GetInt32("TotalShipments"),
            RecordDate = reader.GetDateTime("RecordDate"),
            Status = reader.GetString("Status"),
            WorkID = reader.GetInt32("WorkID"),
            EmployeeName = reader.GetString("EmployeeName")
        });
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

        [Authorize(Roles ="Admin")]
        [HttpPost("close")]
        public async Task<IActionResult> Close([FromBody]int recordId)
        {
            try
            {
                await _db.OpenAsync();

                // Removed the stored procedure here as well!
                var cmd = new MySqlCommand(
                    "UPDATE DAILY_RECORD SET Status = 'Closed' WHERE RecordID = @recordId", _db);

                cmd.Parameters.AddWithValue("@recordId", recordId);

                await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "Daily record closed successfully" });
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
    }
}