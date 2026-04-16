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

    public class CreateTransactionRequest
    {
        public int CustomerID { get; set; }
        public int WorkID { get; set; }
        public int RecordID { get; set; }
        public decimal Total { get; set; }
        public int TotalContainers { get; set; }
        public List<CreateDetailRequest> Details { get; set; }
    }
     public class CreateDetailRequest
    {
        public int ContainerTypeID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitValue { get; set; }
        public decimal Value { get; set; }
    }
    
    public class CreateShipmentRequest
    {
        public int CompanyID { get; set; }
        public int WorkID { get; set; }
        public int RecordID { get; set; }

        public int TotalBags { get; set; }
        public decimal TotalValue { get; set; }
    }

}