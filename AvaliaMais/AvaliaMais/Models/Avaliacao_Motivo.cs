using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AvaliaMais.Models
{
    [Table("avaliacao_motivos")]
    public class Avaliacao_Motivo
    {
        [Key]
        public int Id { get; set; }

        public int Fk_Avaliacoes_Setor_Id { get; set; }

        public int Fk_Motivos_Avaliacao_Id { get; set; }
    }
}