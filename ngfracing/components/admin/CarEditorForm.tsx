import type { CarStatus } from "@prisma/client";
import type { PublicCar } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  car?: PublicCar | null;
};

export function CarEditorForm({ action, car }: Props) {
  return (
    <form action={action} className="stack">
      <input type="hidden" name="carId" defaultValue={car?.id ?? ""} />

      <div className="admin-card stack">
        <div className="field-grid two">
          <div className="field">
            <label htmlFor="title">Titulo</label>
            <input id="title" name="title" defaultValue={car?.title ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="whatsappLink">Link do WhatsApp</label>
            <input
              id="whatsappLink"
              name="whatsappLink"
              type="url"
              defaultValue={car?.whatsappLink ?? "https://wa.me/5551999866578"}
              required
            />
          </div>
        </div>

        <div className="field-grid three">
          <div className="field">
            <label htmlFor="brand">Marca</label>
            <input id="brand" name="brand" defaultValue={car?.brand ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="model">Modelo</label>
            <input id="model" name="model" defaultValue={car?.model ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={(car?.status ?? "AVAILABLE") as CarStatus}>
              <option value="AVAILABLE">Disponivel</option>
              <option value="RESERVED">Reservado</option>
              <option value="SOLD">Vendido</option>
            </select>
          </div>
        </div>

        <div className="field-grid three">
          <div className="field">
            <label htmlFor="year">Ano</label>
            <input id="year" name="year" type="number" defaultValue={car?.year ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="km">KM</label>
            <input id="km" name="km" type="number" defaultValue={car?.km ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="price">Preco (BRL)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={car ? (car.priceCents / 100).toFixed(2) : ""}
              required
            />
          </div>
        </div>

        <div className="field-grid two">
          <div className="field">
            <label htmlFor="fuel">Combustivel</label>
            <input id="fuel" name="fuel" defaultValue={car?.fuel ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="transmission">Cambio</label>
            <input id="transmission" name="transmission" defaultValue={car?.transmission ?? ""} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Descricao</label>
          <textarea id="description" name="description" defaultValue={car?.description ?? ""} required />
        </div>

        <div className="field-grid three">
          <div className="field">
            <label htmlFor="mods">Modificacoes (uma por linha)</label>
            <textarea id="mods" name="mods" defaultValue={car?.mods.join("\n") ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="features">Opcionais (uma por linha)</label>
            <textarea id="features" name="features" defaultValue={car?.features.join("\n") ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="tags">Tags (uma por linha)</label>
            <textarea id="tags" name="tags" defaultValue={car?.tags.join("\n") ?? ""} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="existingImageUrls">URLs de imagens atuais (uma por linha)</label>
          <textarea
            id="existingImageUrls"
            name="existingImageUrls"
            defaultValue={car?.images.map((image) => image.url).join("\n") ?? ""}
          />
        </div>

        <div className="field">
          <label htmlFor="images">Upload de novas imagens (max. 8 no total)</label>
          <input id="images" name="images" type="file" accept="image/*" multiple />
        </div>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <input type="checkbox" name="isFeatured" defaultChecked={car?.isFeatured ?? false} />
          Marcar como destaque
        </label>
      </div>

      <div className="inline-actions">
        <button type="submit" className="button-primary">
          {car ? "Salvar alteracoes" : "Criar carro"}
        </button>
        {car ? (
          <div className="muted" style={{ alignSelf: "center" }}>
            Preco atual: {formatCurrency(car.priceCents)}
          </div>
        ) : null}
      </div>
    </form>
  );
}
