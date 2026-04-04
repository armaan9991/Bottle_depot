using BottleDepot.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace BottleDepot.Controllers
{   
    [ApiController]
    [Route("api/[controller]")]
    public class ContainerTypeController: ControllerBase
    {
        private readonly MySqlConnection _db;

        public ContainerTypeController(MySqlConnection db)
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

                var qry = new MySqlCommand(@"
                    SELECT
                        ContainerTypeID,
                        Material,
                        Refund,
                        BagLimit,
                        SizeCategory,
                        CountMethod
                    FROM CONTAINER_TYPE
                    ORDER BY ContainerTypeID", _db);
         
            var types = new List<ContainerType>();

            var reader = await qry.ExecuteReaderAsync();

            while (await reader.ReadAsync())
                {
                    types.Add(new ContainerType
                    {
                        ContainerTypeID = reader.GetInt32("ContainerTypeID"),
                        Material        = reader.GetString("Material"),
                        Refund          = reader.GetDecimal("Refund"),
                        // BagLimit        = reader.GetInt32("BagLimit"),
                        Size_of_Container    = reader.GetDecimal("Size_of_Container"),
                        CountMethod     = reader.GetString("CountMethod")
                    });
                }
                return Ok(types);
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