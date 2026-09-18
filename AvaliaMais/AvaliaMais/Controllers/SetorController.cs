using Microsoft.AspNetCore.Mvc;
using AvaliaMais.Data;
using AvaliaMais.Models;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
namespace AvaliaMais.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SetorController : ControllerBase
    {
        private readonly AvaliaMaisContext _context;
        public SetorController(AvaliaMaisContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CadastrarSetor([FromBody] Setor setor)
        {
            try
            {
                var idLogado = HttpContext.Session.GetString("IdLogado");

                if (string.IsNullOrEmpty(idLogado))
                {
                    return Unauthorized("Faça login antes.");
                }

                if (setor == null)
                {
                    return BadRequest("Dados do setor não foram enviados.");
                }

                if (string.IsNullOrWhiteSpace(setor.Nome))
                {
                    return BadRequest("O nome do setor é obrigatório.");
                }
                if (string.IsNullOrWhiteSpace(setor.Pergunta))
                {
                    return BadRequest("A pergunta para a avaliação do setor é obrigatório.");
                }

                _context.Setores.Add(setor);

                _context.SaveChanges();

                return Created("", setor);
            }
            catch (Exception ex)
            {
                Console.WriteLine("=================================");
                Console.WriteLine("ERRO AO CADASTRAR SETOR:");
                Console.WriteLine(ex.ToString());
                Console.WriteLine("=================================");

                return StatusCode(500, new
                {
                    erro = ex.Message,
                    detalhe = ex.InnerException?.Message
                });
            }
            [HttpDelete("{id}")]
            public IActionResult DeletarSetor(int id)
            {
                var idLogado = HttpContext.Session.GetString("IdLogado");

                if (idLogado == null)
                {
                    return Unauthorized("Faça login antes.");
                }


                var usuarioLogado = _context.Usuarios
                    .Find(int.Parse(idLogado));


                if (usuarioLogado == null)
                {
                    return Unauthorized("Usuário não encontrado.");
                }




                var areaBanco = _context.Setores
                    .FirstOrDefault(a => a.Id == id);


                if (areaBanco == null)
                {
                    return NotFound("Área não encontrada.");
                }

            }

        } 
    } 
}
