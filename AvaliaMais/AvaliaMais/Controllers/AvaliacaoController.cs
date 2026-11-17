using AvaliaMais.Data;
using AvaliaMais.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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



        // BUSCAR SETORES ATIVOS

        [HttpGet("setores")]
        public IActionResult ListarSetores()
        {
            var setores = _context.Setores
                .Where(s => s.Ativo)
                .ToList();

            return Ok(setores);
        }



        // FINALIZAR PESQUISA


        [HttpPost]
        public IActionResult CadastrarAvaliacao(JsonElement dados)
        {
            // NOTA GERAL
            if (!dados.TryGetProperty("nota", out JsonElement notaJson) ||
                !notaJson.TryGetInt32(out int nota))
            {
                return BadRequest("A nota geral não foi enviada corretamente.");
            }

            if (nota < 1 || nota > 10)
            {
                return BadRequest("A nota da empresa deve estar entre 1 e 10.");
            }

            // COMENTÁRIO (mantido para compatibilidade)
            string? comentario = null;

            if (dados.TryGetProperty("comentario", out JsonElement comentarioJson) &&
                comentarioJson.ValueKind == JsonValueKind.String)
            {
                comentario = comentarioJson.GetString();
            }

            if (comentario != null && comentario.Length > 100)
            {
                return BadRequest("O comentário deve ter no máximo 100 caracteres.");
            }

            // SETORES
            if (!dados.TryGetProperty("setores", out JsonElement setoresJson) ||
                setoresJson.ValueKind != JsonValueKind.Array ||
                setoresJson.GetArrayLength() == 0)
            {
                return BadRequest("Avalie pelo menos um setor antes de finalizar.");
            }

            // Guarda os dados de cada setor e seus motivos
            var setores = new List<(int IdSetor, int Nota, List<int> Motivos)>();

            foreach (var item in setoresJson.EnumerateArray())
            {
                if (item.ValueKind != JsonValueKind.Object)
                {
                    return BadRequest("Dados de setor inválidos.");
                }

                // ID DO SETOR
                int idSetor;

                if (item.TryGetProperty("idSetor", out JsonElement idJson) &&
                    idJson.TryGetInt32(out int idRecebido))
                {
                    idSetor = idRecebido;
                }
                else if (item.TryGetProperty("fk_Setores_Id", out JsonElement fkJson) &&
                         fkJson.TryGetInt32(out int fkRecebido))
                {
                    idSetor = fkRecebido;
                }
                else
                {
                    return BadRequest("O ID de um dos setores não foi enviado.");
                }

                // NOTA DO SETOR
                if (!item.TryGetProperty("nota", out JsonElement notaSetorJson) ||
                    !notaSetorJson.TryGetInt32(out int notaSetor))
                {
                    return BadRequest("A nota de um dos setores não foi enviada corretamente.");
                }

                if (notaSetor < 1 || notaSetor > 5)
                {
                    return BadRequest("A nota dos setores deve estar entre 1 e 5.");
                }

                // VERIFICAR SE O SETOR ESTÁ ATIVO
                var setorBanco = _context.Setores
                    .FirstOrDefault(s => s.Id == idSetor && s.Ativo);

                if (setorBanco == null)
                {
                    return BadRequest("Um dos setores selecionados não está disponível.");
                }

                // MOTIVOS SELECIONADOS
                var idsMotivos = new List<int>();

                if (item.TryGetProperty("motivos", out JsonElement motivosJson))
                {
                    if (motivosJson.ValueKind != JsonValueKind.Array)
                    {
                        return BadRequest("A lista de motivos está inválida.");
                    }

                    foreach (var motivoJson in motivosJson.EnumerateArray())
                    {
                        if (!motivoJson.TryGetInt32(out int idMotivo) ||
                            idMotivo <= 0)
                        {
                            return BadRequest("Um dos motivos informados é inválido.");
                        }

                        idsMotivos.Add(idMotivo);
                    }
                }

                // NÃO PERMITIR MOTIVO REPETIDO
                if (idsMotivos.Count != idsMotivos.Distinct().Count())
                {
                    return BadRequest("Um motivo não pode ser selecionado duas vezes.");
                }

                // CONFERIR SE OS MOTIVOS PERTENCEM AO SETOR E À NOTA
                if (idsMotivos.Count > 0)
                {
                    var quantidadeMotivosValidos = _context.Motivos_Avaliacao
                        .Count(m =>
                            idsMotivos.Contains(m.Id) &&
                            m.Fk_Setores_Id == idSetor &&
                            m.Nota_Referencia == notaSetor);

                    if (quantidadeMotivosValidos != idsMotivos.Count)
                    {
                        return BadRequest(
                            "Um ou mais motivos não correspondem ao setor e à nota selecionados."
                        );
                    }
                }

                setores.Add((idSetor, notaSetor, idsMotivos));
            }

            // NÃO PERMITIR SETOR REPETIDO
            var idsSetores = setores.Select(s => s.IdSetor).ToList();

            if (idsSetores.Count != idsSetores.Distinct().Count())
            {
                return BadRequest("Um setor não pode ser avaliado mais de uma vez.");
            }

            // SALVAR TUDO EM UMA TRANSAÇÃO
            using var transacao = _context.Database.BeginTransaction();

            try
            {
                // CRIAR AVALIAÇÃO GERAL
                var avaliacao = new Avaliacao
                {
                    Nota = nota,
                    Comentario = comentario,
                    Data_Hora = DateTime.Now
                };

                _context.Avaliacoes.Add(avaliacao);
                _context.SaveChanges();

                // SALVAR AVALIAÇÕES DOS SETORES
                var avaliacoesSetor = new List<Avaliacao_Setor>();

                foreach (var setor in setores)
                {
                    var avaliacaoSetor = new Avaliacao_Setor
                    {
                        Nota = setor.Nota,
                        Fk_Setores_Id = setor.IdSetor,
                        Fk_Avaliacoes_Id = avaliacao.Id
                    };

                    avaliacoesSetor.Add(avaliacaoSetor);
                }

                _context.Avaliacoes_Setor.AddRange(avaliacoesSetor);
                _context.SaveChanges();

                // SALVAR OS MOTIVOS ESCOLHIDOS
                var vinculosMotivos = new List<Avaliacao_Motivo>();

                foreach (var setor in setores)
                {
                    var avaliacaoSetor = avaliacoesSetor
                        .First(a => a.Fk_Setores_Id == setor.IdSetor);

                    foreach (var idMotivo in setor.Motivos)
                    {
                        vinculosMotivos.Add(new Avaliacao_Motivo
                        {
                            Fk_Avaliacoes_Setor_Id = avaliacaoSetor.Id,
                            Fk_Motivos_Avaliacao_Id = idMotivo
                        });
                    }
                }

                if (vinculosMotivos.Count > 0)
                {
                    _context.Avaliacoes_Motivos.AddRange(vinculosMotivos);
                    _context.SaveChanges();
                }

                // CONFIRMAR TRANSAÇÃO
                transacao.Commit();

                return Ok(new
                {
                    mensagem = "Pesquisa finalizada com sucesso!",
                    idAvaliacao = avaliacao.Id
                });
            }
            catch (Exception ex)
            {
                transacao.Rollback();

                Console.WriteLine("ERRO AO SALVAR A AVALIAÇÃO:");
                Console.WriteLine(ex.ToString());

                return StatusCode(500, new
                {
                    mensagem = "Ocorreu um erro ao salvar a pesquisa.",
                    erro = ex.Message
                });
            }
        }




        // RESUMO DO DASHBOARD

        [HttpGet("resumo")]
        public IActionResult Resumo(int? dias)
        {
            var avaliacoesQuery = _context.Avaliacoes
                .AsQueryable();

            // FILTRO POR PERÍODO
            if (dias.HasValue)
            {
                var dataLimite = DateTime.Now.AddDays(-dias.Value);

                avaliacoesQuery = avaliacoesQuery
                    .Where(a => a.Data_Hora >= dataLimite);
            }

            var totalAvaliacoes = avaliacoesQuery.Count();

            var mediaGeral = avaliacoesQuery
                .Select(a => (double?)a.Nota)
                .Average() ?? 0;

            var idsAvaliacoes = avaliacoesQuery
                .Select(a => a.Id)
                .ToList();

            var setoresAvaliados = _context.Avaliacoes_Setor
                .Where(a => idsAvaliacoes.Contains(a.Fk_Avaliacoes_Id))
                .Select(a => a.Fk_Setores_Id)
                .Distinct()
                .Count();

            var totalComentarios = avaliacoesQuery
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


        // DESEMPENHO DOS SETORES

       [HttpGet("desempenho-setores")]
public IActionResult DesempenhoSetores(int? dias)
{
    var avaliacoesQuery = _context.Avaliacoes
        .AsQueryable();

    // FILTRO POR PERÍODO
    if (dias.HasValue)
    {
        var dataLimite = DateTime.Now.AddDays(-dias.Value);

        avaliacoesQuery = avaliacoesQuery
            .Where(a => a.Data_Hora >= dataLimite);
    }

    var idsAvaliacoes = avaliacoesQuery
        .Select(a => a.Id)
        .ToList();

    var setores = _context.Setores
        .Where(s => s.Ativo)
        .ToList();

    var resultado = new List<object>();

    foreach (var setor in setores)
    {
        var avaliacoes = _context.Avaliacoes_Setor
            .Where(a =>
                a.Fk_Setores_Id == setor.Id &&
                idsAvaliacoes.Contains(a.Fk_Avaliacoes_Id))
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


        // AVALIAÇÕES RECENTES

        [HttpGet("recentes")]
        public IActionResult AvaliacoesRecentes()
        {
            var avaliacoes = _context.Avaliacoes
                .OrderByDescending(a => a.Data_Hora)
                .Take(10)
                .ToList();


            return Ok(avaliacoes);
        }

        // LISTAR AVALIAÇÕES

        [HttpGet("avaliacoes")]
        public IActionResult ListarAvaliacoes()
        {
            var avaliacoes = _context.Avaliacoes
                .OrderByDescending(a => a.Data_Hora)
                .ToList();

            var resultado = new List<object>();

            foreach (var avaliacao in avaliacoes)
            {
                var setores = _context.Avaliacoes_Setor
                    .Where(a => a.Fk_Avaliacoes_Id == avaliacao.Id)
                    .ToList();

                foreach (var avaliacaoSetor in setores)
                {
                    var setor = _context.Setores
                        .FirstOrDefault(s => s.Id == avaliacaoSetor.Fk_Setores_Id);

                    if (setor != null)
                    {
                        resultado.Add(new
                        {
                            id = avaliacao.Id,
                            setor = setor.Nome,
                            nota = avaliacaoSetor.Nota,
                            notaGeral = avaliacao.Nota,
                            comentario = avaliacao.Comentario,
                            dataHora = avaliacao.Data_Hora
                        });
                    }
                }
            }

            return Ok(resultado);
        }

        [HttpGet("motivos")]
        public async Task<IActionResult> ObterMotivos(
    [FromQuery] int setorId,
    [FromQuery] int nota)
        {
            if (setorId <= 0 || nota < 1 || nota > 5)
            {
                return BadRequest(new
                {
                    mensagem = "Informe um setor válido e uma nota entre 1 e 5."
                });
            }

            var motivos = await _context.Motivos_Avaliacao
                .Where(m => m.Fk_Setores_Id == setorId &&
                            m.Nota_Referencia == nota)
                .Select(m => new
                {
                    id = m.Id,
                    descricao = m.Descricao
                })
                .ToListAsync();

            return Ok(motivos);
        }

    }
}