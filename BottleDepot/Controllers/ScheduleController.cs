using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.DTO;
using BottleDepot.Models;
namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController: ControllerBase
    {
        public readonly MySqlConnection _db;
        public ScheduleController(MySqlConnection db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                await _db.OpenAsync();

                var qry = new MySqlCommand(@"
                 SELECT
                        s.ScheduleID,
                        s.ShiftDate,
                        s.ShiftStart,
                        s.ShiftEnd,
                        s.ShiftDuration,
                        s.IsBusy,
                        s.WorkID,
                        e.Name AS EmployeeName
                    FROM SCHEDULE s
                    JOIN EMPLOYEE e ON s.WorkID = e.WorkID
                    ORDER BY s.ShiftDate, s.ShiftStart", _db);

                var Schedules = new List<ScheduleDTO>();
                var reader = await qry.ExecuteReaderAsync();

                while(await reader.ReadAsync())
                {
                    Schedules.Add(new ScheduleDTO
                    {
                        ScheduleID    = reader.GetInt32("ScheduleID"),
                        ShiftDate     = reader.GetDateTime("ShiftDate"),
                        ShiftStart    = reader.GetTimeSpan("ShiftStart"),
                        ShiftEnd      = reader.GetTimeSpan("ShiftEnd"),
                        ShiftDuration = reader.GetDecimal("ShiftDuration"),
                        IsBusy        = reader.GetBoolean("IsBusy"),
                        WorkID        = reader.GetInt32("WorkID"),
                        EmployeeName  = reader.GetString("EmployeeName")
                    });
                }

                return Ok(Schedules);
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

        [HttpGet("employee/{workId}")]
        public async Task<IActionResult> GetByEmployee(int workId)
        {
            try
            {
                await _db.OpenAsync();
    
                var qry = new MySqlCommand(@"
                    SELECT
                        s.ScheduleID,
                        s.ShiftDate,
                        s.ShiftStart,
                        s.ShiftEnd,
                        s.ShiftDuration,
                        s.IsBusy,
                        s.WorkID,
                        e.Name AS EmployeeName
                    FROM SCHEDULE s
                    JOIN EMPLOYEE e ON s.WorkID = e.WorkID
                    WHERE s.WorkID = @workId
                    ORDER BY s.ShiftDate",_db);

                qry.Parameters.AddWithValue("@workId", workId);

                var Schedules = new List<ScheduleDTO>();

                var reader = await qry.ExecuteReaderAsync();

                while(await reader.ReadAsync())
                {
                    Schedules.Add(new ScheduleDTO
                    {
                        ScheduleID    = reader.GetInt32("ScheduleID"),
                        ShiftDate     = reader.GetDateTime("ShiftDate"),
                        ShiftStart    = reader.GetTimeSpan("ShiftStart"),
                        ShiftEnd      = reader.GetTimeSpan("ShiftEnd"),
                        ShiftDuration = reader.GetDecimal("ShiftDuration"),
                        IsBusy        = reader.GetBoolean("IsBusy"),
                        WorkID        = reader.GetInt32("WorkID"),
                        EmployeeName  = reader.GetString("EmployeeName")
                    });
                }

                return Ok(Schedules);
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

            [HttpPost]
        public async Task<IActionResult> Create([FromBody]CreateScheduleRequest req)
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    INSERT INTO SCHEDULE
                        (ShiftDate, ShiftStart, ShiftEnd,
                         ShiftDuration, IsBusy, WorkID)
                    VALUES
                        (@date, @start, @end,
                         @duration, @busy, @workId)", _db);

                cmd.Parameters.AddWithValue("@date",     req.ShiftDate);
                cmd.Parameters.AddWithValue("@start",    req.ShiftStart);
                cmd.Parameters.AddWithValue("@end",      req.ShiftEnd);
                cmd.Parameters.AddWithValue("@duration", req.ShiftDuration);
                cmd.Parameters.AddWithValue("@busy",     req.IsBusy);
                cmd.Parameters.AddWithValue("@workId",   req.WorkID);

                await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "Schedule created successfully" });
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