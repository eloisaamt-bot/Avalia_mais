using Microsoft.AspNetCore.Mvc;
using AvaliaMais.Data;
using AvaliaMais.Models;

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

        [HttpGet]
        public IActionResult ListarSetores()
        {
            var lista = _context.Setores
                .Where(s => s.Ativo)
                .ToList();

            return Ok(lista);
        }

        [HttpPost]
        public IActionResult CadastrarSetor(Setor setor)
        {
            var idLogado = HttpContext.Session.GetString("IdLogado");

            if (idLogado == null)
            {
                return Unauthorized("Faça o login antes.");
            }

            var usuarioLogado = _context.Usuarios
                .Find(int.Parse(idLogado));

            if (usuarioLogado == null)
            {
                return Unauthorized("Usuário não encontrado.");
            }

            setor.Fk_Usuarios_Id = usuarioLogado.Id;

            if (string.IsNullOrWhiteSpace(setor.Nome))
            {
                return BadRequest("O nome do setor é obrigatório.");
            }

            if (string.IsNullOrWhiteSpace(setor.Pergunta))
            {
                return BadRequest("A pergunta do setor é obrigatória.");
            }

            if (setor.Nome.Length > 100)
            {
                return BadRequest(
                    "O nome do setor deve ter no máximo 100 caracteres."
                );
            }

            if (setor.Pergunta.Length > 100)
            {
                return BadRequest(
                    "A pergunta deve ter no máximo 100 caracteres."
                );
            }

            setor.Ativo = true;

            _context.Add(setor);
            _context.SaveChanges();

            return Created("", setor);
        }

        [HttpPut("{id}")]
        public IActionResult EditarSetor(int id, Setor setor)
        {
            var idLogado = HttpContext.Session.GetString("IdLogado");

            if (idLogado == null)
            {
                return Unauthorized("Faça o login antes.");
            }

            var usuarioLogado = _context.Usuarios
                .Find(int.Parse(idLogado));

            if (usuarioLogado == null)
            {
                return Unauthorized("Usuário não encontrado.");
            }

            var setorBanco = _context.Setores
                .Find(id);

            if (setorBanco == null)
            {
                return NotFound("Setor não encontrado.");
            }

            if (string.IsNullOrWhiteSpace(setor.Nome))
            {
                return BadRequest("O nome do setor é obrigatório.");
            }

            if (string.IsNullOrWhiteSpace(setor.Pergunta))
            {
                return BadRequest("A pergunta do setor é obrigatória.");
            }

            setorBanco.Nome = setor.Nome;
            setorBanco.Pergunta = setor.Pergunta;

            _context.SaveChanges();

            return Ok("Setor atualizado com sucesso.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeletarSetor(int id)
        {
            var idLogado = HttpContext.Session.GetString("IdLogado");

            if (idLogado == null)
            {
                return Unauthorized("Faça o login antes.");
            }

            var usuarioLogado = _context.Usuarios
                .Find(int.Parse(idLogado));

            if (usuarioLogado == null)
            {
                return Unauthorized("Usuário não encontrado.");
            }

            var setorBanco = _context.Setores
                .Find(id);

            if (setorBanco == null)
            {
                return NotFound("Setor não encontrado.");
            }
            setorBanco.Ativo = false;

            _context.SaveChanges();

            return Ok("Setor desativado com sucesso.");
        }
    }
}