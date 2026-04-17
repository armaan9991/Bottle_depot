using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.DTO;
using Microsoft.AspNetCore.Authorization;
namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabelController : ControllerBase
    {
        private readonly MySqlConnection _db;

        public LabelController(MySqlConnection context)
        {
            _db = db;       
         }

       [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLabelDTO dto)
        {
            try
            {
                await _db.OpenAsync();

                if (dto.Weight <= 0)
                    return BadRequest(new { message = "Weight must be greater than 0" });

                var cmd = new MySqlCommand(@"
                    INSERT INTO LABEL
                        (Weight, TagDate, WorkID, TransactionID, ShipmentID, Status)
                    VALUES
                        (@weight, CURDATE(), @workId, @transactionId, @shipmentId, 'Pending');
                    SELECT LAST_INSERT_ID();", _db);

                cmd.Parameters.AddWithValue("@weight", dto.Weight);
                cmd.Parameters.AddWithValue("@workId", dto.WorkID);
                cmd.Parameters.AddWithValue("@transactionId", dto.TransactionID);
                cmd.Parameters.AddWithValue("@shipmentId",
                    dto.ShipmentID.HasValue ? dto.ShipmentID : DBNull.Value);

                var result = await cmd.ExecuteScalarAsync();
                int newId = Convert.ToInt32(result);

                return Ok(new { labelID = newId, message = "Label created successfully" });
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
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    SELECT
                        l.LabelID, l.Weight, l.TagDate, l.Status,
                        l.WorkID, l.TransactionID, l.ShipmentID
                    FROM LABEL l
                    ORDER BY l.TagDate DESC", _db);

                var labels = new List<LabelResponseDTO>();

                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    labels.Add(new LabelResponseDTO
                    {
                        LabelID = reader.GetInt32("LabelID"),
                        Weight = reader.GetDecimal("Weight"),
                        TagDate = reader.GetDateTime("TagDate"),
                        Status = reader.GetString("Status"),
                        WorkID = reader.GetInt32("WorkID"),
                        TransactionID = reader.GetInt32("TransactionID"),
                        ShipmentID = reader.IsDBNull("ShipmentID")
                            ? null
                            : reader.GetInt32("ShipmentID")
                    });
                }

                return Ok(labels);
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
                        l.LabelID, l.Weight, l.TagDate, l.Status,
                        l.WorkID, l.TransactionID, l.ShipmentID
                    FROM LABEL l
                    WHERE l.LabelID = @id", _db);

                cmd.Parameters.AddWithValue("@id", id);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                    return NotFound(new { message = "Label not found" });

                return Ok(new LabelResponseDTO
                {
                    LabelID = reader.GetInt32("LabelID"),
                    Weight = reader.GetDecimal("Weight"),
                    TagDate = reader.GetDateTime("TagDate"),
                    Status = reader.GetString("Status"),
                    WorkID = reader.GetInt32("WorkID"),
                    TransactionID = reader.GetInt32("TransactionID"),
                   ShipmentID = reader.IsDBNull(reader.GetOrdinal("ShipmentID"))
    ? null
    : reader.GetInt32(reader.GetOrdinal("ShipmentID"))
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
        [HttpPost("process")]
        public async Task<IActionResult> MarkProcessed([FromBody] int labelId)
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    UPDATE LABEL
                    SET Status = 'Processed'
                    WHERE LabelID = @id", _db);

                cmd.Parameters.AddWithValue("@id", labelId);

                await cmd.ExecuteNonQueryAsync();

                return Ok(new { message = "Label marked as processed" });
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