using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers
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
        - GetNombreCompleto: Recupera el nombre completo de un cliente por su ID.
        - Post: Crea un nuevo cliente, asignando un nuevo ID y validando que el tipo de cliente exista.

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
                c.id_cliente,
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
            Recupera el nombre completo de un cliente dado su ID.

        Params:
            - id: int - ID del cliente cuyo nombre completo se desea obtener.

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 200 (OK) y el nombre completo del cliente.

        Restriction:
            Si el cliente con el ID proporcionado no existe, se retorna una respuesta HTTP 404 (Not Found).

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpGet("nombreCompleto/{id}")]
        public IActionResult GetNombreCompleto(int id)
        {
            // Obtener el cliente por ID
            var cliente = _clienteService.GetAll().FirstOrDefault(c => c.id_cliente == id);

            // Verificar si el cliente existe
            if (cliente == null)
            {
                return NotFound($"Cliente con ID {id} no encontrado.");
            }

            // Obtener el nombre completo
            var nombreCompleto = cliente.nombre_completo;

            return Ok(new { nombreCompleto });
        }


        /* Function: Post
            Crea un nuevo cliente y lo guarda en el servicio de datos.

        Params:
            - new_Cliente: Cliente - El cliente a crear, proporcionado en el cuerpo de la solicitud (FromBody).

        Returns:
            - IActionResult: Retorna una respuesta HTTP con el código de estado 201 (Created) y el nuevo cliente creado.

        Restriction:
            El tipo de cliente proporcionado debe existir. Si no existe, se retorna una respuesta HTTP 400 (Bad Request).

        Problems:
            Ningún problema conocido durante la implementación de este método.

        References:
            N/A
        */
        [HttpPost]
        public IActionResult Post([FromBody] Cliente new_Cliente)
        {
            // Validar que el tipo_cliente
            var tipos = _tipoClienteService.GetAll();
            var tipoEncontrado = tipos.FirstOrDefault(t => t.tipo == new_Cliente.tipo_id);

            if (tipoEncontrado == null)
            {
                return BadRequest($"El tipo de cliente '{new_Cliente.tipo_id}' no existe.");
            }
            new_Cliente.tipo_cliente = tipoEncontrado;

            // Asignar un nuevo id_cliente
            var clientes = _clienteService.GetAll(); 
            new_Cliente.id_cliente = clientes.Any() ? clientes.Max(c => c.id_cliente) + 1 : 1; // Incrementar el id_cliente previo

            // Guardar el cliente 
            _clienteService.Add(new_Cliente);

            return CreatedAtAction(nameof(Get), new { id = new_Cliente.id_cliente }, new_Cliente);
        }

    }
}
