using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.DTO;
using BottleDepot.Models;
using Microsoft.AspNetCore.Authorization;

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShipmentController : ControllerBase
    {
        private readonly MySqlConnection _db;
        public ShipmentController(MySqlConnection db)
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

        [Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]CreateShipmentRequest req)
        {   
            try
            {
                await _db.OpenAsync();

                // 1. Insert the Shipment directly with the new fields
                var cmd = new MySqlCommand(@"
                    INSERT INTO SHIPMENT 
                        (ShipmentDate, TotalValue, TotalBags, CompanyID)
                    VALUES 
                        (CURDATE(), @totalValue, @totalBags, @companyId);
                        
                    UPDATE DAILY_RECORD
                    SET TotalShipments = TotalShipments + 1
                    WHERE RecordID = @recordId;", _db);

                cmd.Parameters.AddWithValue("@companyId", req.CompanyID);
                cmd.Parameters.AddWithValue("@recordId",  req.RecordID);
                cmd.Parameters.AddWithValue("@totalBags", req.TotalBags);
                cmd.Parameters.AddWithValue("@totalValue", req.TotalValue);

                await cmd.ExecuteNonQueryAsync();

                return Ok(new {
                    message = "Shipment created successfully"
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

        [Authorize]
        [HttpGet("companies")]
        public async Task<IActionResult> GetAllCompanies()
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    SELECT CompanyID, CompanyName
                    FROM RECYCLE_COMPANY
                    ORDER BY CompanyName ASC", _db);

                var companies = new List<RecycleCompanyDTO>();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    companies.Add(new RecycleCompanyDTO
                    {
                        CompanyID   = reader.GetInt32("CompanyID"),
                        CompanyName = reader.GetString("CompanyName"),
                    });
                }

                return Ok(companies);
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