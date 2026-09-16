using Microsoft.EntityFrameworkCore;
using AvaliaMais.Models;
namespace AvaliaMais.Data
{
    public class AvaliaMaisContext : DbContext
    {
        public DbSet<Usuario> Usuarios { get; set; }

        public AvaliaMaisContext(DbContextOptions<AvaliaMaisContext> options)
            : base(options) 
        { 
        
        }
    }
}
