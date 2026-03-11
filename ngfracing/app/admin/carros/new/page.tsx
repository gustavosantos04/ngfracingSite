import Link from "next/link";
import { saveCarAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { CarEditorForm } from "@/components/admin/CarEditorForm";
import { requireAdminSession } from "@/lib/auth";
import { getRepositoryCarImages } from "@/lib/image-library";

export default async function AdminNewCarPage() {
  await requireAdminSession();
  const availableImages = await getRepositoryCarImages();

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
          <p className="section-copy">Cadastro completo com selecao visual de imagens, listas editaveis e status.</p>
        </div>
        <CarEditorForm action={saveCarAction} availableImages={availableImages} />
      </div>
    </AdminShell>
  );
}
