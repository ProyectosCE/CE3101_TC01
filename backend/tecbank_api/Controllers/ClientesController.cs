using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Services;

namespace tecbank_api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly JsonDataService<Cliente> _clienteService;
        private readonly JsonDataService<Tipo_Cliente> _tipoClienteService;

        public ClientesController()
        {
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
            _tipoClienteService = new JsonDataService<Tipo_Cliente>("Data/tipo_clientes.json");
        }

        // Metodo GET para obtener todos los clientes
        [HttpGet]
        public IActionResult Get()
        {
            var clientes = _clienteService.GetAll();
            var tipos = _tipoClienteService.GetAll();

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

        // Metodo GET para obtener nombre completo por ID (atributo compuesto)
        [HttpGet("nombreCompleto/{id}")]
        public IActionResult GetNombreCompleto(int id)
        {
            var cliente = _clienteService.GetAll().FirstOrDefault(c => c.id_cliente == id);

            if (cliente == null)
            {
                return NotFound($"Cliente con ID {id} no encontrado.");
            }

            // Obtener el nombre completo
            var nombreCompleto = cliente.nombre_completo;

            return Ok(new { nombreCompleto });
        }

        // Metodo Post para crear un nuevo cliente
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
