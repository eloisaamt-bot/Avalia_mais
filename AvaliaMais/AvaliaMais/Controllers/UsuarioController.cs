using Microsoft.AspNetCore.Mvc;
using AvaliaMais.Data;
using AvaliaMais.Models;
using System.Linq;
namespace AvaliaMais.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly AvaliaMaisContext _context;
        public UsuarioController(AvaliaMaisContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult ListarUsuarios()
        {
            var usuarios = _context.Usuarios
                .Select(u => new
                {
                    Id = u.Id,
                    Nome = u.Nome
                })
                .ToList();
                             
            return Ok(usuarios);
        }
        [HttpPost("login")]
        public IActionResult Login(Usuario usuario)
        {
            var usuarioBanco = _context.Usuarios.Where
                (u => u.Email.Equals(usuario.Email) &&
                u.Senha.Equals(usuario.Senha)).ToList();
            if (usuarioBanco.Count == 0)
            {
                return Unauthorized("Email ou senha incorretos!");
            }
            return Ok("Logado com sucesso");
            //return Ok(usuarioBanco);

        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            Response.Cookies.Delete("IdLogado");
            Response.Cookies.Delete(".AspNetCore.Session");
            return Ok("logout realizado!");
        }

        [HttpPost]
        public IActionResult CadastraUsuario(Usuario usuario)
        {
            if (string.IsNullOrWhiteSpace(usuario.Nome))
            {
                return BadRequest("O nome é obrigatório.");
            }
            _context.Add(usuario);
            _context.SaveChanges();
            return Ok("Cadastrado com sucesso");
           // return Created("", usuario);
        }




    }
}