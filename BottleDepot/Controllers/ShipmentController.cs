using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.DTO;
using BottleDepot.Models;

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public  class  ShipmentController : ControllerBase
    {
        private readonly MySqlConnection _db;
        public ShipmentController(MySqlConnection db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    SELECT
                        s.ShipmentID,
                        s.ShipmentDate,
                        s.TotalValue,
                        s.TotalBags,
                        s.CompanyID,
                        rc.CompanyName
                    FROM SHIPMENT s
                    JOIN RECYCLE_COMPANY rc
                        ON s.CompanyID = rc.CompanyID
                    ORDER BY s.ShipmentDate DESC", _db);

                    var shipments = new List<ShipmentDTO>();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    shipments.Add(new ShipmentDTO
                    {
                        ShipmentID   = reader.GetInt32("ShipmentID"),
                        ShipmentDate = reader.GetDateTime("ShipmentDate"),
                        TotalValue   = reader.GetDecimal("TotalValue"),
                        TotalBags    = reader.GetInt32("TotalBags"),
                        CompanyID    = reader.GetInt32("CompanyID"),
                        CompanyName  = reader.GetString("CompanyName")
                    });
                }

                return Ok(shipments);
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

         [HttpPost]
         public async Task<IActionResult> Create([FromBody]CreateShipmentRequest req)
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    CALL sp_CreateShipment(
                        @companyId,
                        @workId,
                        @recordId
                    )", _db);

                cmd.Parameters.AddWithValue("@companyId", req.CompanyID);
                cmd.Parameters.AddWithValue("@workId",    req.WorkID);
                cmd.Parameters.AddWithValue("@recordId",  req.RecordID);

                using var reader = await cmd.ExecuteReaderAsync();
                await reader.ReadAsync();
                var newId = reader.GetInt32("NewShipmentID");

                return Ok(new {
                    message    = "Shipment created successfully",
                    shipmentId = newId
                });
            }
            catch (Exception r)
            {
                return StatusCode(500, new { message = r.Message });
            }
            finally
            {
                await _db.CloseAsync();
            }
        }
    }
}