import Link from "next/link";
import { notFound } from "next/navigation";
import { saveProductAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductEditorForm } from "@/components/admin/ProductEditorForm";
import { requireAdminSession } from "@/lib/auth";
import { getProductById } from "@/lib/data";
import { getRepositoryProductImages } from "@/lib/image-library";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProductPage({ params }: Params) {
  await requireAdminSession();

  const { id } = await params;
  const [product, availableImages] = await Promise.all([getProductById(id), getRepositoryProductImages()]);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="stack">
        <div className="inline-actions">
          <Link href="/admin/produtos" className="button-secondary">
            Voltar
          </Link>
          <Link href={`/produtos/${product.slug}`} className="button-ghost">
            Ver pagina publica
          </Link>
        </div>
        <div>
          <span className="section-kicker">Produtos</span>
          <h1 className="section-title" style={{ marginBottom: 8 }}>
            Editar produto
          </h1>
          <p className="section-copy">Atualize preco, estoque, fotos e disponibilidade em um unico formulario.</p>
        </div>
        <ProductEditorForm action={saveProductAction} product={product} availableImages={availableImages} />
      </div>
    </AdminShell>
  );
}
