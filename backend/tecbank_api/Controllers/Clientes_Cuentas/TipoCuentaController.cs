using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Clientes_Cuentas
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoCuentaController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Cuenta> _tipoCuentaService;

        public TipoCuentaController()
        {
            _tipoCuentaService = new JsonDataService<Tipo_Cuenta>("Data/tipo_cuentas.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var tiposCuenta = _tipoCuentaService.GetAll();
            return Ok(tiposCuenta);
        }
    }
}
