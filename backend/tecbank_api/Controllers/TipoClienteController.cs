using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Services;

namespace tecbank_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoClienteController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Cliente> _tipoClienteService;

        public TipoClienteController()
        {
            _tipoClienteService = new JsonDataService<Tipo_Cliente>("Data/tipo_clientes.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var tipos = _tipoClienteService.GetAll();
            return Ok(tipos);
        }
    }
}
