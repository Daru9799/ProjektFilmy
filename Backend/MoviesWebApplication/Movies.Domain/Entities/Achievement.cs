
namespace Movies.Domain.Entities
{
    public class Achievement
    {
        public Guid AchievementId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        //Relacja 
        public ICollection<UserAchievement> UserAchievements { get; set; }
    }
}
