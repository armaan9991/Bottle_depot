using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using BottleDepot.Models;
using BottleDepot.DTO;
using Microsoft.AspNetCore.Authorization;

namespace BottleDepot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly MySqlConnection _db;

        public TransactionController(MySqlConnection db)
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
                        t.TransactionID,
                        t.Date,
                        t.Total,
                        t.TotalContainers,
                        t.CustomerID,
                        t.WorkID,
                        t.RecordID,
                        c.Name AS CustomerName,
                        e.Name AS EmployeeName
                    FROM TRANSACTION t
                    JOIN CUSTOMER  c ON t.CustomerID = c.CustomerID
                    JOIN EMPLOYEE  e ON t.WorkID     = e.WorkID
                    ORDER BY t.Date DESC", _db);

                var transactions = new List<TransactionDTO>();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    transactions.Add(new TransactionDTO
                    {
                        TransactionID   = reader.GetInt32("TransactionID"),
                        Date            = reader.GetDateTime("Date"),
                        Total           = reader.GetDecimal("Total"),
                        TotalContainers = reader.GetInt32("TotalContainers"),
                        CustomerID      = reader.GetInt32("CustomerID"),
                        WorkID          = reader.GetInt32("WorkID"),
                        RecordID        = reader.GetInt32("RecordID"),
                        CustomerName    = reader.GetString("CustomerName"),
                        EmployeeName    = reader.GetString("EmployeeName")
                    });
                }

                return Ok(transactions);
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

                // get transaction
                var cmd = new MySqlCommand(@"
                    SELECT
                        t.TransactionID,
                        t.Date,
                        t.Total,
                        t.TotalContainers,
                        t.CustomerID,
                        t.WorkID,
                        t.RecordID,
                        c.Name AS CustomerName,
                        e.Name AS EmployeeName
                    FROM TRANSACTION t
                    JOIN CUSTOMER c ON t.CustomerID = c.CustomerID
                    JOIN EMPLOYEE e ON t.WorkID     = e.WorkID
                    WHERE t.TransactionID = @id", _db);

                cmd.Parameters.AddWithValue("@id", id);

                using var reader = await cmd.ExecuteReaderAsync();

                if (!await reader.ReadAsync())
                    return NotFound(new { message = "Transaction not found" });

                var transaction = new TransactionDTO
                {
                    TransactionID   = reader.GetInt32("TransactionID"),
                    Date            = reader.GetDateTime("Date"),
                    Total           = reader.GetDecimal("Total"),
                    TotalContainers = reader.GetInt32("TotalContainers"),
                    CustomerID      = reader.GetInt32("CustomerID"),
                    WorkID          = reader.GetInt32("WorkID"),
                    RecordID        = reader.GetInt32("RecordID"),
                    CustomerName    = reader.GetString("CustomerName"),
                    EmployeeName    = reader.GetString("EmployeeName"),
                    Details         = new List<TransactionDetailDTO>()
                };

                await reader.CloseAsync();

                // get transaction details
                var detailCmd = new MySqlCommand(@"
                    SELECT
                        td.TransactionDetailID,
                        td.Quantity,
                        td.UnitValue,
                        td.Value,
                        td.ContainerTypeID,
                        ct.Material
                    FROM TRANSACTION_DETAIL td
                    JOIN CONTAINER_TYPE ct
                        ON td.ContainerTypeID = ct.ContainerTypeID
                    WHERE td.TransactionID = @id", _db);

                detailCmd.Parameters.AddWithValue("@id", id);

                using var detailReader = await detailCmd.ExecuteReaderAsync();

                while (await detailReader.ReadAsync())
                {
                    transaction.Details.Add(new TransactionDetailDTO
                    {
                        TransactionDetailID = detailReader.GetInt32("TransactionDetailID"),
                        Quantity            = detailReader.GetInt32("Quantity"),
                        UnitValue           = detailReader.GetDecimal("UnitValue"),
                        Value               = detailReader.GetDecimal("Value"),
                        ContainerTypeID     = detailReader.GetInt32("ContainerTypeID"),
                        Material            = detailReader.GetString("Material")
                    });
                }

                return Ok(transaction);
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
        [HttpGet("employee/{workId}")]
        public async Task<IActionResult> GetByEmployee(int workId)
        {
            try
            {
                await _db.OpenAsync();

                var cmd = new MySqlCommand(@"
                    SELECT
                        t.TransactionID,
                        t.Date,
                        t.Total,
                        t.TotalContainers,
                        t.CustomerID,
                        t.WorkID,
                        t.RecordID,
                        c.Name AS CustomerName,
                        e.Name AS EmployeeName
                    FROM TRANSACTION t
                    JOIN CUSTOMER c ON t.CustomerID = c.CustomerID
                    JOIN EMPLOYEE e ON t.WorkID     = e.WorkID
                    WHERE t.WorkID = @workId
                    ORDER BY t.Date DESC", _db);

                cmd.Parameters.AddWithValue("@workId", workId);

                var transactions = new List<TransactionDTO>();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    transactions.Add(new TransactionDTO
                    {
                        TransactionID   = reader.GetInt32("TransactionID"),
                        Date            = reader.GetDateTime("Date"),
                        Total           = reader.GetDecimal("Total"),
                        TotalContainers = reader.GetInt32("TotalContainers"),
                        CustomerID      = reader.GetInt32("CustomerID"),
                        WorkID          = reader.GetInt32("WorkID"),
                        RecordID        = reader.GetInt32("RecordID"),
                        CustomerName    = reader.GetString("CustomerName"),
                        EmployeeName    = reader.GetString("EmployeeName")
                    });
                }

                return Ok(transactions);
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
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]CreateTransactionRequest req)
        {
            try
            {
                await _db.OpenAsync();

                // call stored procedure
                var cmd = new MySqlCommand(@"
                    CALL sp_CreateTransaction(
                        @customerId,
                        @workId,
                        @recordId,
                        @total,
                        @totalContainers
                    )", _db);

                cmd.Parameters.AddWithValue("@customerId",      req.CustomerID);
                cmd.Parameters.AddWithValue("@workId",          req.WorkID);
                cmd.Parameters.AddWithValue("@recordId",        req.RecordID);
                cmd.Parameters.AddWithValue("@total",           req.Total);
                cmd.Parameters.AddWithValue("@totalContainers", req.TotalContainers);

                using var reader = await cmd.ExecuteReaderAsync();
                await reader.ReadAsync();
                var newId = reader.GetInt32("NewTransactionID");
                await reader.CloseAsync();

                foreach (var detail in req.Details)
                {
                    var detailCmd = new MySqlCommand(@"
                        INSERT INTO TRANSACTION_DETAIL
                            (TransactionID, Quantity,
                             UnitValue, Value, ContainerTypeID)
                        VALUES
                            (@txnId, @qty,
                             @unitVal, @val, @ctId)", _db);

                    detailCmd.Parameters.AddWithValue("@txnId",  newId);
                    detailCmd.Parameters.AddWithValue("@qty",    detail.Quantity);
                    detailCmd.Parameters.AddWithValue("@unitVal",detail.UnitValue);
                    detailCmd.Parameters.AddWithValue("@val",    detail.Value);
                    detailCmd.Parameters.AddWithValue("@ctId",   detail.ContainerTypeID);

                    await detailCmd.ExecuteNonQueryAsync();
                }

                return Ok(new {
                    message       = "Transaction created successfully",
                    transactionId = newId
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
    }
}