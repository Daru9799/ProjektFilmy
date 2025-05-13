using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Movies.Domain.Entities
{
    public class UserRelation
    {
        [Key]
        public Guid UserRelationId { get; set; }
        public enum RelationType
        {
            Friend, //Znajomi
            Blocked    //Zablokowani
        }
        public RelationType Type { get; set; }
        //Relacja miedzy tabela Users
        public string FirstUserId { get; set; }
        public string SecondUserId { get; set; }
        public User FirstUser { get; set; }
        public User SecondUser { get; set; }
    }
}
