﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Entities
{
    public class Person
    {
        [Key]
        public Guid PersonId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        public DateTime BirthDate { get; set; }
        public string PhotoUrl { get; set; }
        //Polaczenie z tabelą posredniczącą gdzie jest id filmu i rola
        public ICollection<MoviePerson> MoviePerson { get; set; }
        // Userzy, które obserwują tę osobę
        public ICollection<User> Followers { get; set; }
    }
}
