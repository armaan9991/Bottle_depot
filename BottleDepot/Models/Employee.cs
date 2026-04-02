namespace BottleDepot.Employee
{
    public class Employee
    {
        public int WorkID { get; set;}
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
        public decimal WageRate { get; set;}
        public DateTime DateofHire {get;set;}
        public int supervisorId {get;set;}

    }

}