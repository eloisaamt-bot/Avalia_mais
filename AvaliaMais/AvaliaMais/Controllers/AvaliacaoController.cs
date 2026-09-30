using AvaliaMais.Data;
using AvaliaMais.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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
        public IActionResult CadastrarAvaliacao(JsonElement dados)
        {
            // ==========================================
            // NOTA GERAL
            // ==========================================

            if (!dados.TryGetProperty("nota", out JsonElement notaJson))
            {
                return BadRequest("A nota geral não foi enviada.");
            }

            int nota = notaJson.GetInt32();


            // ==========================================
            // COMENTÁRIO
            // ==========================================

            string? comentario = null;

            if (dados.TryGetProperty("comentario", out JsonElement comentarioJson))
            {
                comentario = comentarioJson.GetString();
            }


            // ==========================================
            // SETORES
            // ==========================================

            if (!dados.TryGetProperty("setores", out JsonElement setoresJson))
            {
                return BadRequest("Nenhum setor foi enviado.");
            }

            if (setoresJson.ValueKind != JsonValueKind.Array ||
                setoresJson.GetArrayLength() == 0)
            {
                return BadRequest(
                    "Avalie pelo menos um setor antes de finalizar."
                );
            }


            // ==========================================
            // VALIDAR NOTA GERAL
            // ==========================================

            if (nota < 1 || nota > 10)
            {
                return BadRequest(
                    "A nota da empresa deve estar entre 1 e 10."
                );
            }


            // ==========================================
            // VALIDAR COMENTÁRIO
            // ==========================================

            if (comentario != null && comentario.Length > 100)
            {
                return BadRequest(
                    "O comentário deve ter no máximo 100 caracteres."
                );
            }


            var setores = new List<Avaliacao_Setor>();


            // ==========================================
            // LER SETORES
            // ==========================================

            foreach (var item in setoresJson.EnumerateArray())
            {
                int idSetor;

                // Aceita idSetor
                if (item.TryGetProperty("idSetor", out JsonElement idJson))
                {
                    idSetor = idJson.GetInt32();
                }

                // Também aceita fk_Setores_Id
                else if (item.TryGetProperty(
                    "fk_Setores_Id",
                    out JsonElement fkJson))
                {
                    idSetor = fkJson.GetInt32();
                }

                else
                {
                    return BadRequest(
                        "O ID de um dos setores não foi enviado."
                    );
                }


                // ==========================================
                // NOTA DO SETOR
                // ==========================================

                if (!item.TryGetProperty(
                    "nota",
                    out JsonElement notaSetorJson))
                {
                    return BadRequest(
                        "A nota de um dos setores não foi enviada."
                    );
                }

                int notaSetor = notaSetorJson.GetInt32();


                if (notaSetor < 1 || notaSetor > 5)
                {
                    return BadRequest(
                        "A nota dos setores deve estar entre 1 e 5."
                    );
                }


                // ==========================================
                // VERIFICAR SETOR
                // ==========================================

                var setorBanco = _context.Setores
                    .FirstOrDefault(s =>
                        s.Id == idSetor &&
                        s.Ativo);

                if (setorBanco == null)
                {
                    return BadRequest(
                        "Um dos setores selecionados não está disponível."
                    );
                }


                setores.Add(new Avaliacao_Setor
                {
                    Nota = notaSetor,
                    Fk_Setores_Id = idSetor
                });
            }


            // ==========================================
            // NÃO PERMITIR SETOR REPETIDO
            // ==========================================

            var idsSetores = setores
                .Select(s => s.Fk_Setores_Id)
                .ToList();

            if (idsSetores.Count != idsSetores.Distinct().Count())
            {
                return BadRequest(
                    "Um setor não pode ser avaliado mais de uma vez."
                );
            }


            // ==========================================
            // CRIAR AVALIAÇÃO GERAL
            // ==========================================

            var avaliacao = new Avaliacao
            {
                Nota = nota,
                Comentario = comentario,
                Data_Hora = DateTime.Now
            };

            _context.Avaliacoes.Add(avaliacao);

            _context.SaveChanges();


            // ==========================================
            // SALVAR AVALIAÇÕES DOS SETORES
            // ==========================================

            foreach (var setor in setores)
            {
                setor.Fk_Avaliacoes_Id = avaliacao.Id;

                _context.Avaliacoes_Setor.Add(setor);
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


        // ==========================================
        // RESUMO DO DASHBOARD
        // ==========================================

        [HttpGet("resumo")]
        public IActionResult Resumo()
        {
            var totalAvaliacoes =
                _context.Avaliacoes.Count();


            var mediaGeral = _context.Avaliacoes
                .Select(a => (double?)a.Nota)
                .Average() ?? 0;


            var setoresAvaliados = _context.Avaliacoes_Setor
                .Select(a => a.Fk_Setores_Id)
                .Distinct()
                .Count();


            var totalComentarios = _context.Avaliacoes
                .Count(a =>
                    !string.IsNullOrWhiteSpace(a.Comentario));


            return Ok(new
            {
                totalAvaliacoes,

                mediaGeral = Math.Round(
                    mediaGeral,
                    1
                ),

                setoresAvaliados,

                totalComentarios
            });
        }


        // ==========================================
        // DESEMPENHO DOS SETORES
        // ==========================================

        [HttpGet("desempenho-setores")]
        public IActionResult DesempenhoSetores()
        {
            var setores = _context.Setores
                .Where(s => s.Ativo)
                .ToList();


            var resultado = new List<object>();


            foreach (var setor in setores)
            {
                var avaliacoes = _context.Avaliacoes_Setor
                    .Where(a =>
                        a.Fk_Setores_Id == setor.Id)
                    .ToList();


                var media = avaliacoes
                    .Select(a => (double?)a.Nota)
                    .Average() ?? 0;


                resultado.Add(new
                {
                    id = setor.Id,

                    nome = setor.Nome,

                    media = Math.Round(
                        media,
                        1
                    ),

                    quantidadeAvaliacoes =
                        avaliacoes.Count
                });
            }


            return Ok(resultado);
        }


        // ==========================================
        // AVALIAÇÕES RECENTES
        // ==========================================

        [HttpGet("recentes")]
        public IActionResult AvaliacoesRecentes()
        {
            var avaliacoes = _context.Avaliacoes
                .OrderByDescending(a => a.Data_Hora)
                .Take(10)
                .ToList();


            return Ok(avaliacoes);
        }
    }
}