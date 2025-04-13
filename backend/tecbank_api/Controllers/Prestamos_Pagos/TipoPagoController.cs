using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoPagoController : ControllerBase
    {
        private readonly JsonDataService<Tipo_Pago> _tipoPagoService;
        public TipoPagoController()
        {
            _tipoPagoService = new JsonDataService<Tipo_Pago>("Data/tipo_pagos.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var tiposPago = _tipoPagoService.GetAll();
            return Ok(tiposPago);
        }
    }
}
