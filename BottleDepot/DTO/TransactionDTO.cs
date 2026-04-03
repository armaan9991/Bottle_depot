namespace BottleDepot.DTO
{
    public class TransactionDTO
    {
        public int TransactionID { get; set; }
        public DateTime Date { get; set; }
        public decimal Total { get; set; }
        public int TotalContainers { get; set; }
        public string CustomerName { get; set; }
        public string EmployeeName { get; set; }
        public int CustomerID { get; set; }
        public int WorkID { get; set; }
        public int RecordID { get; set; }
        public List<TransactionDetailDTO> Details { get; set; }
    }

    public class TransactionDetailDTO
    {
        public int TransactionDetailID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitValue { get; set; }
        public decimal Value { get; set; }
        public string Material { get; set; }
        public int ContainerTypeID { get; set; }
    }
}