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
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

/* Class: ClientesController
Controlador de API para manejar las solicitudes relacionadas con los clientes. Permite obtener, crear, editar, borrar y autenticar clientes, así como consultar información y cuentas asociadas.

Attributes:
- _clienteService: JsonDataService<Cliente> - Servicio para manejar los datos de los clientes.
- _tipoClienteService: JsonDataService<Tipo_Cliente> - Servicio para manejar los datos de tipo de cliente.
- _cuentaService: JsonDataService<Cuenta> - Servicio para manejar los datos de las cuentas.

Constructor:
- ClientesController: Inicializa los servicios de clientes, tipos de cliente y cuentas.

Methods:
- Get: Recupera todos los clientes y los tipos de cliente asociados.
- GetNombreCompleto: Recupera el nombre completo de un cliente por su cédula.
- Post: Crea, edita o borra un cliente según el parámetro 'tipo'.
- Login: Maneja la autenticación de usuarios.
- GetUserInfo: Recupera información de un cliente por su nombre de usuario.

Example:
    var controller = new ClientesController();
    var clientes = controller.Get();
    controller.Post(new Cliente { ... }, "nuevo");
*/
namespace tecbank_api.Controllers.Clientes_Cuentas
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        // Servicios para clientes, tipos de cliente y cuentas
        private readonly JsonDataService<Cliente> _clienteService;
        private readonly JsonDataService<Tipo_Cliente> _tipoClienteService;
        private readonly JsonDataService<Cuenta> _cuentaService;

        // Constructor: Inicializa los servicios con las rutas a los archivos JSON.
        public ClientesController()
        {
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
            _tipoClienteService = new JsonDataService<Tipo_Cliente>("Data/tipo_clientes.json");
            _cuentaService = new JsonDataService<Cuenta>("Data/cuentas.json");
        }

        /* Function: Get
        Recupera todos los clientes junto con su tipo de cliente asociado y devuelve los datos en formato JSON.

        Params:
        - Ninguno.

        Returns:
        - IActionResult: Respuesta HTTP 200 (OK) con los datos de los clientes.

        Restriction:
        Depende de los servicios de clientes y tipos de cliente.
        */
        [HttpGet]
        public IActionResult Get()
        {
            // Obtener todos los clientes y tipos de cliente
            var clientes = _clienteService.GetAll();
            var tipos = _tipoClienteService.GetAll();

            // Asignar el tipo de cliente a cada cliente
            foreach (var cliente in clientes)
            {
                cliente.tipo_cliente = tipos.FirstOrDefault(t => t.tipo == cliente.tipo_id);
            }

            var resultado = clientes.Select(c => new
            {
                c.cedula,
                c.direccion,
                c.telefono,
                c.ingreso_mensual,
                c.usuario,
                c.password,
                c.nombre,
                c.apellido1,
                c.apellido2,
                NombreCompleto = c.nombre_completo,
                c.tipo_id
            });

            return Ok(resultado);
        }

        /* Function: GetNombreCompleto
        Recupera el nombre completo de un cliente dado su cédula.

        Params:
        - cedula: string - Cédula del cliente.

        Returns:
        - IActionResult: HTTP 200 (OK) con el nombre completo, o 404 si no existe.

        Restriction:
        El cliente debe existir.
        */
        [HttpGet("nombreCompleto/{cedula}")]
        public IActionResult GetNombreCompleto(string cedula)
        {
            var cliente = _clienteService.GetAll().FirstOrDefault(c => c.cedula == cedula);

            if (cliente == null)
            {
                return NotFound($"Cliente con cédula {cedula} no encontrado.");
            }

            var nombreCompleto = cliente.nombre_completo;

            return Ok(new { nombreCompleto });
        }

        /* Function: Post
        Maneja las operaciones de creación, edición y eliminación de clientes.

        Params:
        - new_Cliente: Cliente - El cliente a crear, editar o borrar.
        - tipo: string - Tipo de operación: "nuevo", "editar", "borrar".

        Returns:
        - IActionResult: Respuesta HTTP según la operación realizada.

        Restriction:
        La cédula debe ser única para crear; el cliente debe existir para editar/borrar.
        */
        [HttpPost]
        public IActionResult Post([FromBody] Cliente new_Cliente, [FromQuery] string tipo)
        {
            if (new_Cliente == null)
            {
                return BadRequest("Cliente no puede ser nulo");
            }

            if (string.IsNullOrEmpty(tipo) || (tipo != "nuevo" && tipo != "editar" && tipo != "borrar"))
            {
                return BadRequest("El tipo debe ser 'nuevo', 'editar' o 'borrar'");
            }

            var clientes = _clienteService.GetAll();
            var existingCliente = clientes.FirstOrDefault(c => c.cedula == new_Cliente.cedula);

            if (tipo == "nuevo")
            {
                if (existingCliente != null)
                {
                    return Conflict($"El cliente con cédula '{new_Cliente.cedula}' ya existe.");
                }

                // Validar que el tipo_cliente exista
                var tipos = _tipoClienteService.GetAll();
                var tipoEncontrado = tipos.FirstOrDefault(t => t.tipo == new_Cliente.tipo_id);

                if (tipoEncontrado == null)
                {
                    return BadRequest($"El tipo de cliente '{new_Cliente.tipo_id}' no existe.");
                }
                new_Cliente.tipo_cliente = tipoEncontrado;

                _clienteService.Add(new_Cliente);
                return CreatedAtAction(nameof(Get), new { cedula = new_Cliente.cedula }, new_Cliente);
            }
            else if (tipo == "editar")
            {
                if (existingCliente == null)
                {
                    return NotFound($"El cliente con cédula '{new_Cliente.cedula}' no existe para editar.");
                }

                // Actualizar los datos del cliente
                existingCliente.direccion = new_Cliente.direccion;
                existingCliente.telefono = new_Cliente.telefono;
                existingCliente.ingreso_mensual = new_Cliente.ingreso_mensual;
                existingCliente.usuario = new_Cliente.usuario;
                existingCliente.password = new_Cliente.password;
                existingCliente.nombre = new_Cliente.nombre;
                existingCliente.apellido1 = new_Cliente.apellido1;
                existingCliente.apellido2 = new_Cliente.apellido2;
                existingCliente.tipo_id = new_Cliente.tipo_id;

                // Validar que el tipo_cliente exista
                var tipos = _tipoClienteService.GetAll();
                var tipoEncontrado = tipos.FirstOrDefault(t => t.tipo == new_Cliente.tipo_id);

                if (tipoEncontrado == null)
                {
                    return BadRequest($"El tipo de cliente '{new_Cliente.tipo_id}' no existe.");
                }
                existingCliente.tipo_cliente = tipoEncontrado;

                _clienteService.Update(existingCliente);
                return Ok(existingCliente);
            }
            else if (tipo == "borrar")
            {
                if (existingCliente == null)
                {
                    return NotFound($"El cliente con cédula '{new_Cliente.cedula}' no existe para borrar.");
                }

                _clienteService.Delete(existingCliente);
                return Ok("El cliente ha sido borrado exitosamente");
            }

            return BadRequest("Operación no válida");
        }

        // Clase auxiliar para solicitudes de login
        public class LoginRequest
        {
            public string usuario { get; set; }
            public string password { get; set; }
        }

        /* Function: Login
        Maneja la autenticación de usuarios.

        Params:
        - loginRequest: LoginRequest - Objeto con usuario y contraseña.

        Returns:
        - IActionResult: HTTP 200 (OK) si la autenticación es válida, 401 si no.

        Restriction:
        Usuario y contraseña deben ser proporcionados.
        */
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.usuario) || string.IsNullOrEmpty(loginRequest.password))
            {
                return BadRequest("Usuario y contraseña son requeridos");
            }

            var user = _clienteService.GetAll().FirstOrDefault(c =>
                c.usuario == loginRequest.usuario &&
                c.password == loginRequest.password);

            if (user != null)
            {
                return Ok(new { login = "valid" });
            }

            return Unauthorized(new { login = "invalid" });
        }

        /* Function: GetUserInfo
        Recupera información básica de un cliente por su nombre de usuario.

        Params:
        - username: string - Nombre de usuario.

        Returns:
        - IActionResult: HTTP 200 (OK) con cédula y nombre completo, o 404 si no existe.

        Restriction:
        El usuario debe existir.
        */
        [HttpGet("userInfo/{username}")]
        public IActionResult GetUserInfo(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("El nombre de usuario es requerido");
            }

            var cliente = _clienteService.GetAll().FirstOrDefault(c => c.usuario == username);

            if (cliente == null)
            {
                return NotFound($"No se encontró usuario con nombre: {username}");
            }

            return Ok(new
            {
                cedula = cliente.cedula,
                nombreCompleto = cliente.nombre_completo
            });
        }
    }
}
