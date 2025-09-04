export function Login() {
  return (
    <div>
      <form>
        <label>Email:</label>
        <input type="text" required placeholder="Digite seu email..." />
        <label>Senha:</label>
        <input type="text" required placeholder="********" />
        <button>Sign In</button>
        <a href="">Esqueceu sua senha?</a>
      </form>
    </div>
  );
}
