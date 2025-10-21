namespace Movies.Domain.DTOs
{
    public class AchievementDto
    {
        public Guid AchievementId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        
        public string ImageUrl { get; set; }
    }
}
