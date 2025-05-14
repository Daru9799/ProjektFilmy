namespace Movies.Domain.Entities
{
    public class UserAchievement
    {
        public Guid UserAchievementId { get; set; }
        public DateTime Date { get; set; }
        public User User { get; set; }
        public Achievement Achievement { get; set; }
    }
}
