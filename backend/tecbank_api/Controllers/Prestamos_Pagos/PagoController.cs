using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Models.Clientes_Cuentas;
using tecbank_api.Services;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagoController : ControllerBase
    {
        private readonly JsonDataService<Pago> _pagoService;
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Tipo_Pago> _tipoPagoService;
        public PagoController()
        {
            _pagoService = new JsonDataService<Pago>("Data/pagos.json");
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _tipoPagoService = new JsonDataService<Tipo_Pago>("Data/tipo_pagos.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var pagos = _pagoService.GetAll();
            return Ok(pagos);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Pago pago)
        {
            if (pago == null)
            {
                return BadRequest("El pago no puede ser nulo");
            }
            // Validar existencia del prestamo
            var prestamos = _prestamoService.GetAll();
            var prestamoExistente = prestamos.Any(p => p.id_prestamo == pago.id_prestamo);
            if (!prestamoExistente)
            {
                return NotFound($"No existe un prestamo con el ID {pago.id_prestamo}");
            }

            // Validar el tipo de pago
            var tiposPagos = _tipoPagoService.GetAll();
            var tipoPagoExistente = tiposPagos.Any(tp => tp.tipo_pago == pago.id_tipo_pago);
            if (!tipoPagoExistente)
            {
                return NotFound($"No existe un tipo de pago con el ID {pago.tipo_pago}");
            }

            _pagoService.Add(pago);

            return CreatedAtAction(nameof(Post), pago);
        }
    }
}
