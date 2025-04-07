namespace tecbank_api.Models
{
    public class Cliente
    {
        public int id_cliente { get; set; }
        public string cedula { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public double ingreso_mensual { get; set; }
        public string usuario { get; set; }
        public string password { get; set; }

        public string nombre { get; set; }
        public string apellido1 { get; set; }
        public string apellido2 { get; set; }
        public string nombre_completo => $"{nombre} {apellido1} {apellido2}".Trim();

        // Foreign key to Tipo_Cliente
        public string tipo_id { get; set; }
        public Tipo_Cliente? tipo_cliente { get; set;}

    }
}
