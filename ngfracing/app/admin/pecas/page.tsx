import { deletePartItemAction, savePartCategoryAction, savePartItemAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/auth";
import { getPartCategories } from "@/lib/data";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminPartsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminSession();

  const categories = await getPartCategories();
  const params = await searchParams;
  const notice = params.saved === "1" ? "Alteracoes salvas." : params.deleted === "1" ? "Item removido." : "";

  return (
    <AdminShell>
      <div className="stack">
      <div>
        <span className="section-kicker">Pecas</span>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          Catalogo FuelTech
        </h1>
        <p className="section-copy">
          CRUD simples para categorias e itens informativos, sem checkout no MVP.
        </p>
      </div>

      {notice ? <div className="admin-card">{notice}</div> : null}

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Nova categoria</h2>
        <form action={savePartCategoryAction} className="inline-actions">
          <input
            name="name"
            placeholder="Ex.: ECU, Wideband, Chicotes"
            aria-label="Nome da categoria"
            style={{
              minWidth: 260,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              padding: "12px 14px"
            }}
          />
          <button type="submit" className="button-primary">
            Criar categoria
          </button>
        </form>
      </div>

      <div className="stack">
        {categories.map((category) => (
          <section key={category.id} className="admin-card stack">
            <div className="inline-actions" style={{ justifyContent: "space-between" }}>
              <h2 style={{ margin: 0 }}>{category.name}</h2>
              <span className="chip">{category.items.length} item(ns)</span>
            </div>

            <form action={savePartItemAction} className="stack">
              <input type="hidden" name="categoryId" value={category.id} />
              <div className="field-grid three">
                <div className="field">
                  <label htmlFor={`name-${category.id}`}>Nome</label>
                  <input id={`name-${category.id}`} name="name" required />
                </div>
                <div className="field">
                  <label htmlFor={`image-${category.id}`}>Imagem (URL)</label>
                  <input id={`image-${category.id}`} name="imageUrl" />
                </div>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 30 }}>
                  <input type="checkbox" name="isFeatured" />
                  Destaque
                </label>
              </div>
              <div className="field">
                <label htmlFor={`description-${category.id}`}>Descricao</label>
                <textarea id={`description-${category.id}`} name="description" required />
              </div>
              <div>
                <button type="submit" className="button-primary">
                  Adicionar item
                </button>
              </div>
            </form>

            <div className="surface-card table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Destaque</th>
                    <th>Descricao</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.isFeatured ? "Sim" : "Nao"}</td>
                      <td className="muted">{item.description}</td>
                      <td>
                        <form action={deletePartItemAction}>
                          <input type="hidden" name="itemId" value={item.id} />
                          <button type="submit" className="button-danger">
                            Excluir
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {!category.items.length ? (
                    <tr>
                      <td colSpan={4} className="muted">
                        Nenhum item cadastrado ainda.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {category.items.length ? (
              <div className="stack">
                <h3 style={{ margin: 0 }}>Editar itens existentes</h3>
                {category.items.map((item) => (
                  <form key={item.id} action={savePartItemAction} className="admin-card stack">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="categoryId" value={category.id} />
                    <div className="field-grid three">
                      <div className="field">
                        <label htmlFor={`edit-name-${item.id}`}>Nome</label>
                        <input id={`edit-name-${item.id}`} name="name" defaultValue={item.name} required />
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-image-${item.id}`}>Imagem (URL)</label>
                        <input id={`edit-image-${item.id}`} name="imageUrl" defaultValue={item.imageUrl ?? ""} />
                      </div>
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 30 }}>
                        <input type="checkbox" name="isFeatured" defaultChecked={item.isFeatured} />
                        Destaque
                      </label>
                    </div>
                    <div className="field">
                      <label htmlFor={`edit-description-${item.id}`}>Descricao</label>
                      <textarea
                        id={`edit-description-${item.id}`}
                        name="description"
                        defaultValue={item.description}
                        required
                      />
                    </div>
                    <div>
                      <button type="submit" className="button-secondary">
                        Salvar item
                      </button>
                    </div>
                  </form>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>
      </div>
    </AdminShell>
  );
}
