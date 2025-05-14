using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Movies.Domain.Entities;

namespace Movies.Application.Interfaces
{
    public interface INotificationSender
    {
        Task SendAsync(Notification notification);
    }
}
