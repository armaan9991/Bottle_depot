namespace BottleDepot.Schdule
{
 public class  Schdule
 {
    public int SchduleID {get;set;}
    public int WorkID {get;set;}
    public DateTime ShiftDate {get; set;}
    public decimal ShiftDuration {get; set;}
    public bool IsBusy {get; set;}
    public TimeSpan ShiftEnd {get; set;}
    public TimeSpan ShiftStart {get; set;}
 }
}