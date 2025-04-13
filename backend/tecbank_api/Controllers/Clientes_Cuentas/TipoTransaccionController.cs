using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoTransaccionController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Transaccion> _tipoTransaccionService;
        public TipoTransaccionController()
        {
            _tipoTransaccionService = new JsonDataService<Tipo_Transaccion>("Data/tipo_transacciones.json");
        }
        [HttpGet]
        public IActionResult Get()
        {
            var tiposTransaccion = _tipoTransaccionService.GetAll();
            return Ok(tiposTransaccion);
        }
    }
}
