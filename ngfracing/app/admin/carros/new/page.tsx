import Link from "next/link";
import { saveCarAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { CarEditorForm } from "@/components/admin/CarEditorForm";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminNewCarPage() {
  await requireAdminSession();

  return (
    <AdminShell>
      <div className="stack">
      <div className="inline-actions">
        <Link href="/admin/carros" className="button-secondary">
          Voltar
        </Link>
      </div>
      <div>
        <span className="section-kicker">Carros</span>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          Novo carro
        </h1>
        <p className="section-copy">
          Cadastro completo com status, destaque, listas editaveis e upload local validado.
        </p>
      </div>
        <CarEditorForm action={saveCarAction} />
      </div>
    </AdminShell>
  );
}
