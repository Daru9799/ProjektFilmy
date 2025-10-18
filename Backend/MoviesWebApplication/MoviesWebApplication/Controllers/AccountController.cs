using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Movies.Domain.Entities;
using Movies.Domain.DTOs;
using Google.Apis.Auth;
using Movies.Infrastructure;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using static System.Runtime.InteropServices.JavaScript.JSType;
using MoviesWebApplication.Common.Responses;
using Movies.Application.Users.Commands.Login;
using MoviesWebApplication.Common;
using Movies.Application.Account;
using static Movies.Application.Account.AccountChangePassword;

namespace MoviesWebApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly DataContext _context;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager, TokenService tokenService, DataContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserSessionDto>> Login(UserLoginDto loginDto)
        {
            var command = new AccountLogin.LoginCommand
            {
                Email = loginDto.Email,
                Password = loginDto.Password
            };
            return await Mediator.SendWithTypedExceptionHandling(command);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserSessionDto>> Register(UserRegisterDto registerDto)
        {
            var command = new AccountRegister.RegisterCommand
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                Password = registerDto.Password
            };
            return await Mediator.SendWithTypedExceptionHandling(command);
        }

        [Authorize]
        [HttpPatch("edit")]
        public async Task<IActionResult> EditUser(EditUserDto editUserDto)
        {
            var command = new AccountEdit.EditUserCommand
            {
                NewLogin = editUserDto.NewLogin,
                NewEmail = editUserDto.NewEmail,
                User = User
            };

            return await Mediator.SendWithExceptionHandling(command, "Profil został zaktualizowany");
        }
        [Authorize]
        [HttpPatch("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var command = new AccountChangePassword.ChangePasswordCommand
            {
                CurrentPassword = changePasswordDto.CurrentPassword,
                NewPassword = changePasswordDto.NewPassword,
                User = User
            };

            return await Mediator.SendWithExceptionHandling(command, "Hasło zostało zmienione.");
        }

        //Autentykacja przy użyciu google
        [AllowAnonymous]
        [HttpPost("google-login")]
        public async Task<ActionResult<UserSessionDto>> GoogleLogin(UserGoogleLoginDto dto)
        {
            var command = new AccountGoogleLogin.GoogleLoginCommand
            {
                IdToken = dto.IdToken,
                UserName = dto.UserName
            };

            return await Mediator.SendWithTypedExceptionHandling(command);
        }
    }
}
