
namespace Movies.Domain.DTOs
{
    public class MovieCollectionDto
    {
        public ICollection<MovieDto> Movies { get; set; }
        public string UserName { get; set; }
        public Guid MovieCollectionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ShareMode { get; set; }  // Może być typu string, aby zwrócić nazwę wartości enum
        public bool AllowCopy { get; set; }
        public string CollectionType { get; set; }  // Może być typu string, aby zwrócić nazwę wartości enum
        public int LikesCounter { get; set; } = 0;
        public string UserId { get; set; }
    }
}
