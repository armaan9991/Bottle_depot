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
                        dr.RecordID,
                        dr.TotalTransaction,
                        dr.TotalValuePaid,
                        dr.TotalContainer,
                        dr.TotalShipments,
                        dr.RecordDate,
                        dr.Status,
                        dr.WorkID,
                        e.Name AS EmployeeName
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

                var cmd = new MySqlCommand(@"
                    SELECT
                        dr.RecordID,
                        dr.TotalTransaction,
                        dr.TotalValuePaid,
                        dr.TotalContainer,
                        dr.TotalShipments,
                        dr.RecordDate,
                        dr.Status,
                        dr.WorkID,
                        e.Name AS EmployeeName
                    FROM DAILY_RECORD dr
                    JOIN EMPLOYEE e ON dr.WorkID = e.WorkID
                    WHERE DATE(dr.RecordDate) = CURDATE()", _db);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                     return Ok(null);

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
        public async Task<IActionResult> Close( [FromBody]int recordId)
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(
                    "CALL sp_CloseDailyRecord(@recordId, 1)", _db);

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