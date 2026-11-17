using Microsoft.EntityFrameworkCore;
using AvaliaMais.Models;
namespace AvaliaMais.Data
{
    public class AvaliaMaisContext : DbContext
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Setor> Setores { get; set; }
        public DbSet<Avaliacao> Avaliacoes { get; set; }
        public DbSet<Avaliacao_Setor> Avaliacoes_Setor { get; set;}
        public DbSet<Motivo_Avaliacao> Motivos_Avaliacao { get; set; }
        public DbSet<Avaliacao_Motivo> Avaliacoes_Motivos { get; set; }

        public AvaliaMaisContext(DbContextOptions<AvaliaMaisContext> options)
            : base(options) 
        { 
        
        }
    }
}
