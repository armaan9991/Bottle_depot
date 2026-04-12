namespace BottleDepot.Models
{
    public class ContainerType
    {
        public int ContainerTypeID { get; set; }
        public string Material { get; set; } = string.Empty;
        public decimal Refund { get; set; }
        public decimal Size_of_Container { get; set; }
        public string CountMethod { get; set; } = string.Empty;
    }
}