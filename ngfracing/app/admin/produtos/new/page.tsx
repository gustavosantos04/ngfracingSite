import Link from "next/link";
import { saveProductAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";
import { requireAdminSession } from "@/lib/auth";
import { getRepositoryProductImages } from "@/lib/image-library";

export default async function AdminNewProductPage() {
  await requireAdminSession();
  const availableImages = await getRepositoryProductImages();

  return (
    <AdminShell>
      <div className="stack">
        <div className="inline-actions">
          <Link href="/admin/produtos" className="button-secondary">
            Voltar
          </Link>
        </div>
        <div>
          <span className="section-kicker">Produtos</span>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Novo produto
          </h1>
          <p className="section-copy">Cadastre pecas, roupas e acessorios com selecao visual de categoria e imagens.</p>
        </div>
        <ProductEditorForm action={saveProductAction} availableImages={availableImages} />
      </div>
    </AdminShell>
  );
}
