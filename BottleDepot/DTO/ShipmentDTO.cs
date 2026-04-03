namespace BottleDepot.DTO
{
    public class ShipmentDTO
    {
        public int ShipmentID { get; set; }
        public DateTime ShipmentDate { get; set; }
        public decimal TotalValue { get; set; }
        public int TotalBags { get; set; }
        public int CompanyID { get; set; }
        public string CompanyName { get; set; }
    }
}