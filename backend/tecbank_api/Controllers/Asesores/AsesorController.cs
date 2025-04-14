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

/* Class: AsesorController
Controlador API para la gestión de asesores en el sistema TecBank.
Permite obtener, crear, editar y borrar asesores, validando la existencia de roles y la integridad de los datos.

Attributes:
- _asesorService: JsonDataService<Asesor> - Servicio para acceder y manipular los datos de asesores.
- _rolService: JsonDataService<Rol> - Servicio para acceder y validar los roles de los asesores.

Constructor:
- AsesorController: Inicializa los servicios de datos para asesores y roles.

Methods:
- Get: Obtiene la lista de todos los asesores.
- Post: Permite crear, editar o borrar un asesor según el parámetro 'tipo'.

Example:
    var controller = new AsesorController();
    var asesores = controller.Get();
    controller.Post(new Asesor { ... }, "nuevo");
*/
namespace tecbank_api.Controllers.Asesores
{
    [ApiController] // Indica que la clase es un controlador de API.
    [Route("api/[controller]")] // Define la ruta base para las solicitudes HTTP.
    public class AsesorController : ControllerBase
    {
        // Servicio para manipular datos de asesores.
        private readonly JsonDataService<Asesor> _asesorService;
        // Servicio para manipular datos de roles.
        private readonly JsonDataService<Rol> _rolService;

        // Constructor: Inicializa los servicios de asesores y roles.
        public AsesorController()
        {
            _asesorService = new JsonDataService<Asesor>("Data/asesores.json");
            _rolService = new JsonDataService<Rol>("Data/roles.json");
        }

        /* Function: Get
        Obtiene la lista de todos los asesores registrados.

        Params:
        - Ninguno.

        Returns:
        - IActionResult: Devuelve un objeto Ok con la lista de asesores.

        Restriction:
        Solo acepta solicitudes HTTP GET.
        */
        [HttpGet]
        public IActionResult Get()
        {
            var asesores = _asesorService.GetAll(); // Obtiene todos los asesores.
            return Ok(asesores); // Retorna la lista.
        }

        /* Function: Post
        Permite crear, editar o borrar un asesor según el parámetro 'tipo'.

        Params:
        - asesor: Asesor - Objeto asesor recibido en el cuerpo de la solicitud.
        - tipo: string - Indica la operación: 'nuevo', 'editar' o 'borrar'.

        Returns:
        - IActionResult: Resultado de la operación (creado, editado, borrado, error, etc).

        Restriction:
        Solo acepta solicitudes HTTP POST. El parámetro 'tipo' debe ser válido.
        */
        [HttpPost]
        public IActionResult Post([FromBody] Asesor asesor, [FromQuery] string tipo)
        {
            if (asesor == null)
            {
                return BadRequest("El asesor no puede ser nulo");
            }

            // Valida el tipo de operación.
            if (string.IsNullOrEmpty(tipo) || (tipo != "nuevo" && tipo != "editar" && tipo != "borrar"))
            {
                return BadRequest("El tipo debe ser 'nuevo', 'editar' o 'borrar'");
            }

            var asesores = _asesorService.GetAll(); // Obtiene todos los asesores.
            var existingAsesor = asesores.FirstOrDefault(a => a.id_asesor == asesor.id_asesor); // Busca asesor existente.

            if (tipo == "nuevo")
            {
                if (existingAsesor != null)
                {
                    return Conflict("El asesor ya existe");
                }

                // Validar existencia del rol
                var roles = _rolService.GetAll();
                if (!roles.Any(r => r.id_rol == asesor.id_rol))
                {
                    return NotFound($"No existe un rol con el ID {asesor.id_rol}");
                }

                // Asigna un nuevo id_asesor incremental.
                asesor.id_asesor = asesores.Any() ? asesores.Max(a => a.id_asesor) + 1 : 1;
                _asesorService.Add(asesor); // Agrega el asesor.
                return CreatedAtAction(nameof(Post), new { id = asesor.id_asesor }, asesor);
            }
            else if (tipo == "editar")
            {
                if (existingAsesor == null)
                {
                    return NotFound("El asesor no existe para editar");
                }

                // Actualiza los datos del asesor.
                existingAsesor.nombre = asesor.nombre;
                existingAsesor.cedula = asesor.cedula;
                existingAsesor.fecha_nacimiento = asesor.fecha_nacimiento;
                existingAsesor.monto_meta = asesor.monto_meta;
                existingAsesor.id_rol = asesor.id_rol;
                _asesorService.Update(existingAsesor);
                return Ok(existingAsesor);
            }
            else if (tipo == "borrar")
            {
                if (existingAsesor == null)
                {
                    return NotFound("El asesor no existe para borrar");
                }

                _asesorService.Delete(existingAsesor); // Elimina el asesor.
                return Ok("El asesor ha sido borrado exitosamente");
            }

            return BadRequest("Operación no válida");
        }
    }
}
