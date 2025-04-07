namespace tecbank_api.Models
{
    public class TIPO_CLIENTE
    {
        public string tipo { get; set; }

        public string descripcion { get; set; }

        public List<CLIENTE> clientes { get; set; } = new();
    }
}
