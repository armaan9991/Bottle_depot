namespace BottleDepot.Label
{
    public class Label
    {
        public int LabelID { get; set; }
        public int WorkID {get; set;}
        public int TransactionID {get; set;}
        public int ShipmentID {get; set;}
        public decimal Weight {get;set;}
        public DateTime TagDate{ get;set;}        
    }
}