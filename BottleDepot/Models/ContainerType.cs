namespace BottleDepot.Models
{
    public class ContainerType
    {
        public int ContainerTypeID { get; set; }
        public string Material { get; set; }
        public decimal Refund { get; set; }
        public int BagLimit { get; set; }
        public string SizeCategory { get; set; }
        public string CountMethod { get; set; }
    }
}