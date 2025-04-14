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

/* Class: AdminLoginModel
Modelo de datos para la autenticación de administradores en el sistema TecBank.

Attributes:
- Username: string - Nombre de usuario del administrador.
- Password: string - Contraseña del administrador.

Constructor:
- AdminLoginModel: Constructor por defecto.

Example:
    var admin = new AdminLoginModel { Username = "admin", Password = "1234" };
*/
namespace tecbank_api.Models.Admins
{
    public class AdminLoginModel
    {
        // Nombre de usuario del administrador.
        public string Username { get; set; }
        // Contraseña del administrador.
        public string Password { get; set; }
    }
}
