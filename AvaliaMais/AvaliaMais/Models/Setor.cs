using System.ComponentModel.DataAnnotations;

namespace AvaliaMais.Models
{
    public class Setor
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Pergunta { get; set; }
        public int Fk_Usuarios_Id { get; set; }
    }
}
