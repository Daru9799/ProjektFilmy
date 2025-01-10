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
                    UserName = user.UserName,
                    Token = "bedzie pozniej"
                    //Token = _tokenService.CreateToken(user) //Generowanie tokenu
                };
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserSessionDto>> Register(UserRegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                return BadRequest("Nazwa jest zajęta!");
            }

            var user = new User
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return new UserSessionDto
                {
                    UserName = user.UserName,
                    Token = "Tu bedzie token"
                    //Token = _tokenService.CreateToken(user)
                };
            }
            foreach (var error in result.Errors)
            {
                Console.WriteLine(error.Description);
            }
            return BadRequest("Problem z zarejestrowaniem użytkownika");
        }
    }
}
