using System.ComponentModel.DataAnnotations;

namespace AvaliaMais.Models
{
    public class Avaliacao
    {
        [Key]
        public int Id { get; set; }
        public int Nota { get; set; }
        public string Comentario { get; set; }
        public DateTime Data_Hora { get; set; }



    }
}

