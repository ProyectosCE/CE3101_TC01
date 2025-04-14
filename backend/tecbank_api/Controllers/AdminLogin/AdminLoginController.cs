/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Admins;
using tecbank_api.Services;

/* Class: AdminLoginController
Controlador API para gestionar el inicio de sesión de administradores en el sistema TecBank.
Se encarga de recibir solicitudes de autenticación, validar credenciales y responder con el estado del login.

Attributes:
- _adminService: JsonDataService<AdminLoginModel> - Servicio para acceder a los datos de administradores almacenados en un archivo JSON.

Constructor:
- AdminLoginController: Inicializa el servicio de datos de administradores con la ruta al archivo JSON correspondiente.

Methods:
- Login: Recibe las credenciales de un administrador y valida si son correctas, devolviendo el estado del login.

Example:
    var controller = new AdminLoginController();
    var result = controller.Login(new AdminLoginModel { Username = "admin", Password = "1234" });
*/
namespace tecbank_api.Controllers.AdminLogin
{
    [ApiController] // Indica que esta clase es un controlador de API.
    [Route("api/[controller]")] // Define la ruta base para las solicitudes HTTP.
    public class AdminLoginController : ControllerBase
    {
        // Servicio para acceder a los datos de administradores.
        private readonly JsonDataService<AdminLoginModel> _adminService;

        // Constructor: Inicializa el servicio de datos con la ruta al archivo JSON de administradores.
        public AdminLoginController()
        {
            _adminService = new JsonDataService<AdminLoginModel>("Data/admins.json");
        }

        /* Function: Login
        Procesa la solicitud de inicio de sesión de un administrador, validando sus credenciales.

        Params:
        - loginRequest: AdminLoginModel - Objeto que contiene el nombre de usuario y la contraseña enviados en la solicitud.

        Returns:
        - IActionResult: Devuelve un objeto Ok con { login = "valid" } si las credenciales son correctas,
          o Unauthorized con { login = "invalid" } si son incorrectas.

        Restriction:
        Solo acepta solicitudes HTTP POST en la ruta 'api/AdminLogin/login'.
        */
        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginModel loginRequest)
        {
            // Obtiene la lista de administradores desde el archivo JSON.
            var admins = _adminService.GetAll();

            // Busca un administrador que coincida con el usuario y contraseña proporcionados.
            var admin = admins.FirstOrDefault(a => a.Username == loginRequest.Username && a.Password == loginRequest.Password);

            // Si se encuentra un administrador válido, retorna éxito.
            if (admin != null)
            {
                return Ok(new { login = "valid" });
            }

            // Si no se encuentra, retorna no autorizado.
            return Unauthorized(new { login = "invalid" });
        }
    }
}
