using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MoviesWebApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
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
                    Token = _tokenService.CreateToken(user) //Generowanie tokenu
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

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                return BadRequest("Email jest już przypisany do innego konta!");
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
                    Token = _tokenService.CreateToken(user)
                };
            }
            foreach (var error in result.Errors)
            {
                Console.WriteLine(error.Description);
            }
            return BadRequest("Problem z zarejestrowaniem użytkownika");
        }
        [Authorize]
        [HttpPatch("edit")]
        public async Task<IActionResult> EditUser(EditUserDto editUserDto)
        {
            //Pobranie aktualnie zalogowanego użytkownika
            var userId = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("Nie można zweryfikować użytkownika.");
            }
                
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }
                

            //Aktualizacja e-maila
            if (!string.IsNullOrEmpty(editUserDto.NewEmail))
            {
                if (await _userManager.Users.AnyAsync(u => u.Email == editUserDto.NewEmail && u.Id.ToString() != userId))
                {
                    return BadRequest("Podany adres e-mail jest już używany przez innego użytkownika.");
                }

                user.Email = editUserDto.NewEmail;
                var emailResult = await _userManager.UpdateAsync(user);

                if (!emailResult.Succeeded)
                {
                    return BadRequest("Nie udało się zaktualizować adresu e-mail.");
                }
            }

            //Aktualizacja nazwy użytkownika
            if (!string.IsNullOrEmpty(editUserDto.NewLogin))
            {
                if (await _userManager.Users.AnyAsync(u => u.UserName == editUserDto.NewLogin && u.Id.ToString() != userId))
                {
                    return BadRequest("Podana nazwa użytkownika jest już zajęta.");
                }

                user.UserName = editUserDto.NewLogin;
                var loginResult = await _userManager.UpdateAsync(user);

                if (!loginResult.Succeeded)
                {
                    return BadRequest("Nie udało się zaktualizować nazwy użytkownika.");
                }
            }

            return Ok(new
            {
                Message = "Dane użytkownika zostały zaktualizowane.",
                User = new
                {
                    user.Id,
                    user.Email,
                    user.UserName
                }
            });
        }
        [Authorize]
        [HttpPatch("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            //Pobranie ID aktualnie zalogowanego użytkownika
            var userId = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("Nie można zweryfikować użytkownika.");
            }
                
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }

            var passwordVerificationResult = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, changePasswordDto.NewPassword);
            if (passwordVerificationResult == PasswordVerificationResult.Success)
            {
                return BadRequest(new { Errors = new List<string> { "Nowe hasło musi się różnić od aktualnego." } });
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();

                if (result.Errors.Any(e => e.Code == "PasswordMismatch"))
                {
                    return BadRequest(new { Errors = new List<string> { "Podano nieprawidłowe aktualne hasło." } });
                }

                return BadRequest(new { Errors = errors });
            }

            return Ok("Hasło zostało zmienione pomyślnie.");
        }
    }
}
