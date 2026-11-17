using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AvaliaMais.Models
{
    [Table("motivos_avaliacao")]
    public class Motivo_Avaliacao
    {
        [Key]
        public int Id { get; set; }

        public string Descricao { get; set; }

        public int Nota_Referencia { get; set; }

        public int Fk_Setores_Id { get; set; }
    }
}