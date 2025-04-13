using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Tarjetas
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoTarjetaController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Tarjeta> _tipoTarjetaService;
        public TipoTarjetaController()
        {
            _tipoTarjetaService = new JsonDataService<Tipo_Tarjeta>("Data/tipo_tarjetas.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var tiposTarjeta = _tipoTarjetaService.GetAll();
            return Ok(tiposTarjeta);
        }
    }
}
