using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.Models;
using Microsoft.AspNetCore.Authorization;

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/containertype")]
    public class ContainerTypeController : ControllerBase
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

                var cmd = new MySqlCommand(@"
                    SELECT
                        ContainerTypeID,
                        Material,
                        Refund,
                        Size_of_Container,
                        CountMethod
                    FROM CONTAINER_TYPE
                    ORDER BY ContainerTypeID", _db);

                var types = new List<ContainerType>();

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    types.Add(new ContainerType
                    {
                        ContainerTypeID   = reader.GetInt32("ContainerTypeID"),
                        Material          = reader.GetString("Material"),
                        Refund            = reader.GetDecimal("Refund"),
                        Size_of_Container = reader.GetDecimal("Size_of_Container"),
                        CountMethod       = reader.GetString("CountMethod")
                    });
                }

                return Ok(types);
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