using Microsoft.AspNetCore.Mvc;
using tecbank_api.Models.Asesores;
using tecbank_api.Models.Prestamos_Pagos;
using tecbank_api.Services;
using tecbank_api.Models.Clientes_Cuentas;

namespace tecbank_api.Controllers.Prestamos_Pagos
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrestamoController : ControllerBase
    {
        private readonly JsonDataService<Prestamo> _prestamoService;
        private readonly JsonDataService<Asesor> _asesorService;
        private readonly JsonDataService<Cliente> _clienteService;

        public PrestamoController()
        {
            _prestamoService = new JsonDataService<Prestamo>("Data/prestamos.json");
            _asesorService = new JsonDataService<Asesor>("Data/asesores.json");
            _clienteService = new JsonDataService<Cliente>("Data/clientes.json");
        }

        [HttpGet]
        public IActionResult Get()
        {
            var prestamos = _prestamoService.GetAll();
            return Ok(prestamos);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Prestamo prestamo)
        {
            if (prestamo == null)
            {
                return BadRequest("El prestamo no puede ser nulo");
            }
            // Validar existencia del asesor
            var asesores = _asesorService.GetAll();
            var asesorExistente = asesores.Any(a => a.id_asesor == prestamo.id_asesor);
            if (!asesorExistente)
            {
                return NotFound($"No existe un asesor con el ID {prestamo.id_asesor}");
            }
            // Validar existencia del cliente
            var clientes = _clienteService.GetAll();
            var clienteExistente = clientes.Any(c => c.id_cliente == prestamo.id_cliente);
            if (!clienteExistente)
            {
                return NotFound($"No existe un cliente con el ID {prestamo.id_cliente}");
            }

            // Asignar datos adicionales
            var prestamos = _prestamoService.GetAll();
            prestamo.id_prestamo = prestamos.Any() ? prestamos.Max(p => p.id_prestamo) + 1 : 1; // Incrementar el id_prestamo previo

            _prestamoService.Add(prestamo);
            return CreatedAtAction(nameof(Post), new { id = prestamo.id_prestamo }, prestamo);
        }

        [HttpGet("consultarPrestamos/{id_cliente}")]
        public IActionResult consultarPrestamos(int id_cliente)
        {
            var prestamos = _prestamoService.GetAll()
                .Where(p => p.id_cliente == id_cliente)
                .ToList();

            return Ok(prestamos);
        }

        [HttpPost("solicitarPrestamo")]
        public IActionResult solicitarPrestamo([FromQuery] double monto, [FromQuery] int plazoMeses)
        {
            double tasaInteresAnual = 0.10;
            double cuota = calcularCuotaMensual(monto, plazoMeses, tasaInteresAnual);
            var prestamoSimulado = new
            {
                monto_original = monto,
                plazo = plazoMeses,
                tasa_interes = tasaInteresAnual,
                cuota_mensual = cuota,
                total_a_pagar = cuota * plazoMeses
            };

            return Ok(prestamoSimulado);
        }

        [HttpPost("realizarPrestamo")]
        public IActionResult realizarPrestamo([FromQuery] int id_cliente, [FromQuery] double monto, [FromQuery] int plazoMeses)
        {
            var clientes = _clienteService.GetAll();
            if (!clientes.Any(c => c.id_cliente == id_cliente))
                return NotFound("Cliente no encontrado");

            double tasaInteresAnual = 0.10;
            double cuota = calcularCuotaMensual(monto, plazoMeses, tasaInteresAnual);

            var nuevoPrestamo = new Prestamo
            {
                id_prestamo = _prestamoService.GetAll().Any() ? _prestamoService.GetAll().Max(p => p.id_prestamo) + 1 : 1,
                id_cliente = id_cliente,
                monto_original = monto,
                saldo = monto,
                tasa_interes = tasaInteresAnual,
                fecha_inicio = DateOnly.FromDateTime(DateTime.Today),
                fecha_final = DateOnly.FromDateTime(DateTime.Today.AddMonths(plazoMeses)),
                id_asesor = 0 // aún no asignado
            };

            _prestamoService.Add(nuevoPrestamo);
            return CreatedAtAction(nameof(realizarPrestamo), new { id = nuevoPrestamo.id_prestamo }, nuevoPrestamo);
        }

        [HttpPost("aprobarPrestamo")]
        public IActionResult aprobarPrestamo([FromQuery] int id_prestamo, [FromQuery] int id_asesor)
        {
            var prestamos = _prestamoService.GetAll();
            var prestamo = prestamos.FirstOrDefault(p => p.id_prestamo == id_prestamo);
            if (prestamo == null)
                return NotFound("Préstamo no encontrado");

            var asesores = _asesorService.GetAll();
            if (!asesores.Any(a => a.id_asesor == id_asesor))
                return NotFound("Asesor no encontrado");

            prestamo.id_asesor = id_asesor;

            _prestamoService.SaveAll(prestamos);
            return Ok(true);
        }

        [NonAction]
        public double calcularCuotaMensual(double monto, int plazoMeses, double tasaInteresAnual)
        {
            double tasaMensual = tasaInteresAnual / 12;
            return Math.Round((monto * tasaMensual) / (1 - Math.Pow(1 + tasaMensual, -plazoMeses)), 2);
        }
    }
}
