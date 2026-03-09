import type { Metadata } from "next";
import { loginAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Login Admin"
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <div className="admin-shell" style={{ display: "grid", placeItems: "center", padding: 24 }}>
      <main className="admin-card" style={{ width: "min(460px, 100%)" }}>
        <div className="stack">
          <div>
            <div className="section-kicker">Admin</div>
            <h1 className="section-title" style={{ fontSize: "2rem" }}>
              Entrar no CMS
            </h1>
            <p className="section-copy">Login por usuario ou e-mail e senha com sessao via cookie seguro.</p>
          </div>
          {error ? (
            <div className="admin-card" style={{ padding: 14, borderColor: "rgba(215,0,0,0.3)" }}>
              Credenciais invalidas.
            </div>
          ) : null}
          <form action={loginAction} className="stack">
            <div className="field">
              <label htmlFor="identifier">Usuario ou e-mail</label>
              <input id="identifier" name="identifier" type="text" autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <button type="submit" className="button-primary">
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
