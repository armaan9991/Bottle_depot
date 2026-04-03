namespace BottleDepot.DTO
{
    public class DailyRecordDTO
    {
        public int RecordID { get; set; }
        public int TotalTransactions { get; set; }
        public decimal TotalValuePaidOut { get; set; }
        public int TotalContainers { get; set; }
        public int TotalShipments { get; set; }
        public DateTime RecordDate { get; set; }
        public string Status { get; set; }
        public int WorkID { get; set; }
        public string EmployeeName { get; set; }
    }
}