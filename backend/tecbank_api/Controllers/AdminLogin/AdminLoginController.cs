using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Admins;
using tecbank_api.Services;

namespace tecbank_api.Controllers.AdminLogin
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminLoginController : ControllerBase
    {
        private readonly JsonDataService<AdminLogin> _adminService;

        public AdminLoginController()
        {
            _adminService = new JsonDataService<AdminLogin>("Data/admins.json");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLogin loginRequest)
        {
            var admins = _adminService.GetAll();
            var admin = admins.FirstOrDefault(a => a.Username == loginRequest.Username && a.Password == loginRequest.Password);

            if (admin != null)
            {
                return Ok(new { login = "valid" });
            }

            return Unauthorized(new { login = "invalid" });
        }
    }
}
