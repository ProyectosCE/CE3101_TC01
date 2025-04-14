using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{

    /* Class: ClientesController
        Controlador de API para manejar las solicitudes relacionadas con los clientes. Permite obtener, crear y actualizar información de los clientes.

    Attributes:
        - _clienteService: JsonDataService<Cliente> - Servicio para manejar los datos de los clientes, basado en un archivo JSON.
        - _tipoClienteService: JsonDataService<Tipo_Cliente> - Servicio para manejar los datos de tipo de cliente, basado en un archivo JSON.

    Constructor:
        - ClientesController: Constructor predeterminado que inicializa los servicios `JsonDataService<Cliente>` y `JsonDataService<Tipo_Cliente>` con las rutas a los archivos JSON "Data/clientes.json" y "Data/tipo_clientes.json".

    Methods:
        - Get: Recupera todos los clientes y los tipos de cliente asociados, devolviendo los datos en formato JSON.
        - GetNombreCompleto: Recupera el nombre completo de un cliente por su cédula.
        - Post: Crea un nuevo cliente, validando que la cédula no exista y que el tipo de cliente exista.

    Problems:
        Ningún problema conocido durante la implementación de esta clase.

    References:
        N/A
    */
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        // Datos de los clientes y tipos de cliente
        private readonly JsonDataService<Cliente> _clienteService;
        private readonly JsonDataService<Tipo_Cliente> _tipoClienteService;

        // Constructor
        public ClientesController()
        {
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
            _tipoClienteService = new JsonDataService<Tipo_Cliente>("Data/tipo_clientes.json");
        }


        /* Function: Get
            Recupera todos los clientes junto con su tipo de cliente asociado y devuelve los datos en formato JSON.

        Params:
            - N/A

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y los datos de los clientes en formato JSON.

        Restriction:
            Depende de los servicios `JsonDataService<Cliente>` y `JsonDataService<Tipo_Cliente>` para recuperar los datos desde los archivos JSON.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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
            - cedula: string - Cédula del cliente cuyo nombre completo se desea obtener.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y el nombre completo del cliente.

        Restriction:
            Si el cliente con la cédula proporcionada no existe, se retorna una respuesta HTTP 404 (Not Found).

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet("nombreCompleto/{cedula}")]
        public IActionResult GetNombreCompleto(string cedula)
        {
            // Obtener el cliente por cédula
            var cliente = _clienteService.GetAll().FirstOrDefault(c => c.cedula == cedula);

            // Verificar si el cliente existe
            if (cliente == null)
            {
                return NotFound($"Cliente con cédula {cedula} no encontrado.");
            }

            // Obtener el nombre completo
            var nombreCompleto = cliente.nombre_completo;

            return Ok(new { nombreCompleto });
        }


        /* Function: Post
            Maneja las operaciones de creación, edición y eliminación de clientes.

        Params:
            - new_Cliente: Cliente - El cliente a crear, editar o borrar, proporcionado en el cuerpo de la solicitud (FromBody).
            - tipo: string - Tipo de operación a realizar ("nuevo", "editar", "borrar").

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado correspondiente según la operación realizada.

        Restriction:
            La cédula proporcionada debe ser única para las operaciones de creación.
            El cliente debe existir para las operaciones de edición y eliminación.

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
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

                // Guardar el cliente
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

    }
}
