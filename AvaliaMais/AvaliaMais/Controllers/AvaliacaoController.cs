using Microsoft.AspNetCore.Mvc;
using AvaliaMais.Data;
using AvaliaMais.Models;

namespace AvaliaMais.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AvaliacaoController : ControllerBase
    {
        private readonly AvaliaMaisContext _context;

        public AvaliacaoController(AvaliaMaisContext context)
        {
            _context = context;
        }

        // Buscar setores ativos
        [HttpGet("setores")]
        public IActionResult ListarSetores()
        {
            var setores = _context.Setores
                .Where(s => s.Ativo)
                .ToList();

            return Ok(setores);
        }


        // Registrar avaliação
        [HttpPost]
        public IActionResult CadastrarAvaliacao(
            int idSetor,
            int notaSetor,
            int notaEmpresa,
            string? comentario)
        {
            // Verifica se o setor existe
            var setor = _context.Setores
                .FirstOrDefault(s =>
                    s.Id == idSetor &&
                    s.Ativo);

            if (setor == null)
            {
                return BadRequest("Setor não encontrado.");
            }


            // Verifica nota do setor
            if (notaSetor < 1 || notaSetor > 5)
            {
                return BadRequest(
                    "A nota do setor deve estar entre 1 e 5."
                );
            }


            // Verifica nota da empresa
            if (notaEmpresa < 1 || notaEmpresa > 10)
            {
                return BadRequest(
                    "A nota da empresa deve estar entre 1 e 10."
                );
            }


            // Verifica comentário
            if (comentario != null &&
                comentario.Length > 100)
            {
                return BadRequest(
                    "O comentário deve ter no máximo 100 caracteres."
                );
            }


            // Cria a avaliação geral
            var avaliacao = new Avaliacao
            {
                Nota = notaEmpresa,
                Comentario = comentario,
                Data_Hora = DateTime.Now
            };

            _context.Avaliacoes.Add(avaliacao);

            _context.SaveChanges();


            // Cria a avaliação do setor
            var avaliacaoSetor = new Avaliacao_Setor
            {
                Nota = notaSetor,
                Fk_Setores_Id = idSetor,
                Fk_Avaliacoes_Id = avaliacao.Id
            };

            _context.Avaliacao_Setor.Add(avaliacaoSetor);

            _context.SaveChanges();


            return Ok(new
            {
                mensagem = "Avaliação registrada com sucesso!"
            });
        }
    }
}