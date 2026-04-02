namespace BottleDepot.TransactionDetail{
    public class TransactionDetail
    {
        public  int TransactionDetailID {get; set;}
        public  int TransactionID {get; set;}
        public  int Quantity {get; set;}
        public  int ContainerTypeID {get; set;}
        public decimal UnitValue{get; set;}
        public decimal Value {get; set;}
    }
}