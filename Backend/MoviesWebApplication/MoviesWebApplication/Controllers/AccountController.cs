﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Movies.Domain.Entities;
using Movies.Domain.DTOs;
using Google.Apis.Auth;
using Movies.Infrastructure;

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
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Unauthorized();
            }

            if (user.IsGoogleUser)
            {
                return Unauthorized("Użytkownik z kontem Google nie może logować się w ten sposób!");
            }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                await EnsureDefaultCollections(user); //Opcjonalnie dodaje listy objerzanych/planowanych jeśli nie ma

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
                //Dodanie domyślnych kolekcji obejrzanych i planowanych
                var watchedCollection = new MovieCollection
                {
                    Title = "Obejrzane",
                    Description = "Lista obejrzanych filmów",
                    ShareMode = MovieCollection.VisibilityMode.Private,
                    AllowCopy = false,
                    Type = MovieCollection.CollectionType.Watched,
                    User = user
                };

                var plannedCollection = new MovieCollection
                {
                    Title = "Planowane",
                    Description = "Lista filmów do obejrzenia",
                    ShareMode = MovieCollection.VisibilityMode.Private,
                    AllowCopy = false,
                    Type = MovieCollection.CollectionType.Planned,
                    User = user
                };

                //Zapis do bazy
                _context.MovieCollections.Add(watchedCollection);
                _context.MovieCollections.Add(plannedCollection);
                await _context.SaveChangesAsync();

                //Zwrócenie tokenu na front
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

            if (user.IsGoogleUser && !string.IsNullOrEmpty(editUserDto.NewEmail) && !(user.Email == editUserDto.NewEmail))
            {
                return BadRequest("Nie można edytować adresu e-mail dla konta Google.");
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

            if (user.IsGoogleUser)
            {
                return BadRequest(new { Errors = new List<string> { "Nie można zmienić hasła dla konta Google." } });
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

        //Autentykacja przy użyciu google
        [AllowAnonymous]
        [HttpPost("google-login")]
        public async Task<ActionResult<UserSessionDto>> GoogleLogin(UserGoogleLoginDto dto)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken);

            var email = payload.Email;
            var nameFromGoogle = payload.Name;

            var user = await _userManager.FindByEmailAsync(email);

            //Sprawdzam czy istnieje już taki user (jeśli nie to rejestracja)
            if (user == null)
            {
                if (string.IsNullOrWhiteSpace(dto.UserName))
                {
                    return BadRequest("Brakuje nazwy użytkownika do rejestracji.");
                }

                if (await _userManager.Users.AnyAsync(x => x.UserName == dto.UserName))
                {
                    return BadRequest("Nazwa jest zajęta!");
                }

                user = new User
                {
                    Email = email,
                    UserName = dto.UserName,
                    IsGoogleUser = true
                };

                var result = await _userManager.CreateAsync(user);

                if (result.Succeeded)
                {
                    //Dodanie domyślnych kolekcji obejrzanych i planowanych
                    var watchedCollection = new MovieCollection
                    {
                        Title = "Obejrzane",
                        Description = "Lista obejrzanych filmów",
                        ShareMode = MovieCollection.VisibilityMode.Private,
                        AllowCopy = false,
                        Type = MovieCollection.CollectionType.Watched,
                        User = user
                    };

                    var plannedCollection = new MovieCollection
                    {
                        Title = "Planowane",
                        Description = "Lista filmów do obejrzenia",
                        ShareMode = MovieCollection.VisibilityMode.Private,
                        AllowCopy = false,
                        Type = MovieCollection.CollectionType.Planned,
                        User = user
                    };

                    //Zapis do bazy
                    _context.MovieCollections.Add(watchedCollection);
                    _context.MovieCollections.Add(plannedCollection);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    return BadRequest("Nie udało się utworzyć konta.");
                }
            }

            //Logowanie i przekazanie JWT
            await EnsureDefaultCollections(user);
            return new UserSessionDto
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }


        //Metoda pomocnicza zapewiająca że konta utworzone przed listami je otrzymają (obejrzane i planowane)
        private async Task EnsureDefaultCollections(User user)
        {
            var existingCollections = await _context.MovieCollections
                .Include(mc => mc.User)
                .Where(mc => mc.User.Id == user.Id)
                .Select(mc => mc.Type)
                .ToListAsync();

            if (!existingCollections.Contains(MovieCollection.CollectionType.Watched))
            {
                var watchedCollection = new MovieCollection
                {
                    Title = "Obejrzane",
                    Description = "Lista obejrzanych filmów",
                    ShareMode = MovieCollection.VisibilityMode.Private,
                    AllowCopy = false,
                    Type = MovieCollection.CollectionType.Watched,
                    User = user
                };
                _context.MovieCollections.Add(watchedCollection);
            }

            if (!existingCollections.Contains(MovieCollection.CollectionType.Planned))
            {
                var plannedCollection = new MovieCollection
                {
                    Title = "Planowane",
                    Description = "Lista filmów do obejrzenia",
                    ShareMode = MovieCollection.VisibilityMode.Private,
                    AllowCopy = false,
                    Type = MovieCollection.CollectionType.Planned,
                    User = user
                };
                _context.MovieCollections.Add(plannedCollection);
            }

            // Jeżeli coś dodaliśmy — zapisujemy zmiany
            if (_context.ChangeTracker.HasChanges())
            {
                await _context.SaveChangesAsync();
            }
        }
    }
}
