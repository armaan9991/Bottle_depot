namespace BottleDepot.DTO
{
    public class EmployeeDTO
    {
        public int WorkID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
        public decimal WageRate { get; set; }
        public DateTime DateOfHire { get; set; }
        public int? SupervisorID { get; set; }
        public string SupervisorName { get; set; }
    } 
}