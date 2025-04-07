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
    }
}
