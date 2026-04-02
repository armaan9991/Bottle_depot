namespace BottleDepot.Transaction
{
    public class Transaction{
        public int TransactionID    {get; set;}
        public int TotalContainers  { get; set;}
        public int CustomerID   {get; set;}
        public int WorkID {get; set;}
        public int RecordID {get; set;}
        public DateTime TransactionDate {get; set;}
        public decimal Total {get; set;}
    }
}