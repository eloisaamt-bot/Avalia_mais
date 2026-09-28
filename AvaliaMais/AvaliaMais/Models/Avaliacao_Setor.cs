using System.ComponentModel.DataAnnotations;

namespace AvaliaMais.Models
{
    public class Avaliacao_Setor
    {
        [Key]
        public int Id { get; set; }

        public int Nota { get; set; }

        public int Fk_Setores_Id { get; set; }

        public int Fk_Avaliacoes_Id { get; set; }
    }
}
