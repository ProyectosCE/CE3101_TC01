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
using tecbank_api.Models.Asesores;
using tecbank_api.Services;

/* Class: RolCrontroller
Controlador API para la gestión de roles de asesores en el sistema TecBank.
Permite obtener, crear, editar y borrar roles, asegurando la integridad de los datos.

Attributes:
- _tipoRol: JsonDataService<Rol> - Servicio para acceder y manipular los datos de roles.

Constructor:
- RolCrontroller: Inicializa el servicio de datos para roles.

Methods:
- Get: Obtiene la lista de todos los roles.
- Post: Permite crear, editar o borrar un rol según el parámetro 'tipo'.

Example:
    var controller = new RolCrontroller();
    var roles = controller.Get();
    controller.Post(new Rol { ... }, "nuevo");
*/
namespace tecbank_api.Controllers.Asesores
{
    [ApiController] // Indica que la clase es un controlador de API.
    [Route("api/[controller]")] // Define la ruta base para las solicitudes HTTP.
    public class RolCrontroller : ControllerBase
    {
        // Servicio para manipular datos de roles.
        private readonly JsonDataService<Rol> _tipoRol;

        // Constructor: Inicializa el servicio de roles.
        public RolCrontroller()
        {
            _tipoRol = new JsonDataService<Rol>("Data/roles.json");
        }

        /* Function: Get
        Obtiene la lista de todos los roles registrados.

        Params:
        - Ninguno.

        Returns:
        - IActionResult: Devuelve un objeto Ok con la lista de roles.

        Restriction:
        Solo acepta solicitudes HTTP GET.
        */
        [HttpGet]
        public IActionResult Get()
        {
            var roles = _tipoRol.GetAll(); // Obtiene todos los roles.
            return Ok(roles); // Retorna la lista.
        }

        /* Function: Post
        Permite crear, editar o borrar un rol según el parámetro 'tipo'.

        Params:
        - rol: Rol - Objeto rol recibido en el cuerpo de la solicitud.
        - tipo: string - Indica la operación: 'nuevo', 'editar' o 'borrar'.

        Returns:
        - IActionResult: Resultado de la operación (creado, editado, borrado, error, etc).

        Restriction:
        Solo acepta solicitudes HTTP POST. El parámetro 'tipo' debe ser válido.
        */
        [HttpPost]
        public IActionResult Post([FromBody] Rol rol, [FromQuery] string tipo)
        {
            if (rol == null)
            {
                return BadRequest("Rol no puede ser nulo");
            }

            // Valida el tipo de operación.
            if (string.IsNullOrEmpty(tipo) || (tipo != "nuevo" && tipo != "editar" && tipo != "borrar"))
            {
                return BadRequest("El tipo debe ser 'nuevo', 'editar' o 'borrar'");
            }

            var roles = _tipoRol.GetAll(); // Obtiene todos los roles.
            var existingRole = roles.FirstOrDefault(r => r.id_rol == rol.id_rol); // Busca rol existente.

            if (tipo == "nuevo")
            {
                if (existingRole != null)
                {
                    return Conflict("El rol ya existe");
                }
                _tipoRol.Add(rol); // Agrega el rol.
                return CreatedAtAction(nameof(Post), new { id = rol.id_rol }, rol);
            }
            else if (tipo == "editar")
            {
                if (existingRole == null)
                {
                    return NotFound("El rol no existe para editar");
                }
                // Actualiza la descripción del rol.
                existingRole.descripcion = rol.descripcion;
                _tipoRol.Update(existingRole);
                return Ok(existingRole);
            }
            else if (tipo == "borrar")
            {
                if (existingRole == null)
                {
                    return NotFound("El rol no existe para borrar");
                }
                if (existingRole.id_rol != rol.id_rol)
                {
                    return BadRequest("El id_rol del rol no coincide");
                }
                _tipoRol.Delete(existingRole); // Elimina el rol.
                return Ok("El rol ha sido borrado exitosamente");
            }

            return BadRequest("Operación no válida");
        }
    }
}
