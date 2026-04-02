namespace BottleDepot.Models
{
    public class LoginRequest
    {
    public int WorkID{get;set;}
    public string Password{get;set;}

    }

    public class CreateCustomerRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
    public class CreateEmployeeRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
        public decimal WageRate { get; set; }
        public DateTime DateOfHire { get; set; }
        public string Password { get; set; }
        public int? SupervisorID { get; set; }
    }

    public class CreateScheduleRequest
    {
        public DateTime ShiftDate { get; set; }
        public TimeSpan ShiftStart { get; set; }
        public TimeSpan ShiftEnd { get; set; }
        public decimal ShiftDuration { get; set; }
        public bool IsBusy { get; set; }
        public int WorkID { get; set; }
    }

}