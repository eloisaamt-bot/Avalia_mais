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


        // ==========================================
        // BUSCAR SETORES ATIVOS
        // ==========================================

        [HttpGet("setores")]
        public IActionResult ListarSetores()
        {
            var setores = _context.Setores
                .Where(s => s.Ativo)
                .ToList();

            return Ok(setores);
        }


        // ==========================================
        // FINALIZAR PESQUISA
        // ==========================================

        [HttpPost]
        public IActionResult CadastrarAvaliacao(
            [FromBody] PesquisaAvaliacao pesquisa)
        {
            // Verifica a nota geral da empresa

            if (pesquisa.Nota < 1 || pesquisa.Nota > 10)
            {
                return BadRequest(
                    "A nota da empresa deve estar entre 1 e 10."
                );
            }


            // Verifica se pelo menos um setor foi avaliado

            if (pesquisa.Setores == null ||
                pesquisa.Setores.Count == 0)
            {
                return BadRequest(
                    "Avalie pelo menos um setor antes de finalizar."
                );
            }


            // Verifica o comentário

            if (pesquisa.Comentario != null &&
                pesquisa.Comentario.Length > 100)
            {
                return BadRequest(
                    "O comentário deve ter no máximo 100 caracteres."
                );
            }


            // Verifica as notas dos setores

            foreach (var setor in pesquisa.Setores)
            {
                if (setor.Nota < 1 || setor.Nota > 5)
                {
                    return BadRequest(
                        "A nota dos setores deve estar entre 1 e 5."
                    );
                }
            }


            // Verifica se os setores existem e estão ativos

            foreach (var setor in pesquisa.Setores)
            {
                var setorBanco = _context.Setores
                    .FirstOrDefault(s =>
                        s.Id == setor.IdSetor &&
                        s.Ativo);

                if (setorBanco == null)
                {
                    return BadRequest(
                        "Um dos setores selecionados não está disponível."
                    );
                }
            }


            // ==========================================
            // SALVA A AVALIAÇÃO GERAL
            // ==========================================

            var avaliacao = new Avaliacao
            {
                Nota = pesquisa.Nota,
                Comentario = pesquisa.Comentario,
                Data_Hora = DateTime.Now
            };

            _context.Avaliacoes.Add(avaliacao);

            _context.SaveChanges();


            // ==========================================
            // SALVA AS NOTAS DOS SETORES
            // ==========================================

            foreach (var setor in pesquisa.Setores)
            {
                var avaliacaoSetor = new Avaliacao_Setor
                {
                    Nota = setor.Nota,
                    Fk_Setores_Id = setor.IdSetor,
                    Fk_Avaliacoes_Id = avaliacao.Id
                };

                _context.Avaliacoes_Setor.Add(avaliacaoSetor);
            }

            _context.SaveChanges();


            // ==========================================
            // RETORNO
            // ==========================================

            return Ok(new
            {
                mensagem = "Pesquisa finalizada com sucesso!",
                idAvaliacao = avaliacao.Id
            });
        }
    }


    // ==========================================
    // DADOS DA PESQUISA
    // ==========================================

    public class PesquisaAvaliacao
    {
        public int Nota { get; set; }

        public string? Comentario { get; set; }

        public List<AvaliacaoSetorRequest> Setores { get; set; }
            = new List<AvaliacaoSetorRequest>();
    }


    // ==========================================
    // DADOS DE CADA SETOR
    // ==========================================

    public class AvaliacaoSetorRequest
    {
        public int IdSetor { get; set; }

        public int Nota { get; set; }
    }
}