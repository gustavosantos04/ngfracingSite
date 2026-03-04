import Link from "next/link";
import { notFound } from "next/navigation";
import { saveCarAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { CarEditorForm } from "@/components/admin/CarEditorForm";
import { requireAdminSession } from "@/lib/auth";
import { getAllCars } from "@/lib/data";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditCarPage({ params }: Params) {
  await requireAdminSession();

  const { id } = await params;
  const cars = await getAllCars();
  const car = cars.find((entry) => entry.id === id);

  if (!car) {
    notFound();
  }

  return (
    <AdminShell>
      <div className="stack">
      <div className="inline-actions">
        <Link href="/admin/carros" className="button-secondary">
          Voltar
        </Link>
        <Link href={`/estoque/${car.slug}`} className="button-ghost">
          Ver pagina publica
        </Link>
      </div>
      <div>
        <span className="section-kicker">Carros</span>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          Editar carro
        </h1>
        <p className="section-copy">
          Ajuste conteudo, imagens, tags, status e CTA do WhatsApp no mesmo formulario.
        </p>
      </div>
        <CarEditorForm action={saveCarAction} car={car} />
      </div>
    </AdminShell>
  );
}
