using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain;
using Microsoft.EntityFrameworkCore;

namespace MoviesWebApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        //private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager)
        {
            _userManager = userManager;
            //_tokenService = tokenService;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserSessionDto>> Login(UserLoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                return new UserSessionDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Token = "bedzie pozniej"
                    //Token = _tokenService.CreateToken(user) //Generowanie tokenu
                };
            }

            return Unauthorized();
        }
    }
}
