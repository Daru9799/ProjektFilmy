﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
