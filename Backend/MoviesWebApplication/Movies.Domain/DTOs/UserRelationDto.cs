using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class UserRelationDto
    {
        public Guid RelationId { get; set; }
        public string RelatedUserId { get; set; }
        public string RelatedUserName { get; set; }
        public string Type { get; set; }
    }
}
