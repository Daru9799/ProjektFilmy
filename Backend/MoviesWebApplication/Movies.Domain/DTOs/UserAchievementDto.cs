using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class UserAchievementDto
    {
        public Guid UserAchievementId { get; set; }
        public DateTime Date { get; set; }
        public AchievementDto Achievement { get; set; }
    }
}
