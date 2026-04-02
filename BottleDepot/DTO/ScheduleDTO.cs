namespace BottleDepot.DTO
{
    public class ScheduleDTO
    {
        public int ScheduleID { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan ShiftStart { get; set; }
        public TimeSpan ShiftEnd { get; set; }
        public decimal ShiftDuration { get; set; }
        public bool IsBusy { get; set; }
        public int WorkID { get; set; }
        public string EmployeeName { get; set; }
    }
}