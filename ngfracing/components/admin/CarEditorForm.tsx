"use client";

import type { CarStatus } from "@prisma/client";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { AdminPendingState, AdminSubmitButton } from "@/components/admin/AdminFormControls";
import { RepositoryImagePicker } from "@/components/admin/RepositoryImagePicker";
import { CAR_FEATURE_CATEGORIES, CAR_FEATURE_OPTIONS } from "@/lib/constants";
import type { RepositoryImageOption } from "@/lib/image-library";
import type { PublicCar } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  availableImages: RepositoryImageOption[];
  car?: PublicCar | null;
};

export function CarEditorForm({ action, availableImages, car }: Props) {
  const presetFeatureSet = useMemo(() => new Set(CAR_FEATURE_OPTIONS), []);
  const [kmDigits, setKmDigits] = useState(car ? String(car.km) : "");
  const [priceDigits, setPriceDigits] = useState(car ? String(car.priceCents) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPresetFeatures, setSelectedPresetFeatures] = useState<string[]>(
    car?.features.filter((feature) => presetFeatureSet.has(feature as (typeof CAR_FEATURE_OPTIONS)[number])) ?? []
  );
  const [customFeatures, setCustomFeatures] = useState(
    car?.features.filter((feature) => !presetFeatureSet.has(feature as (typeof CAR_FEATURE_OPTIONS)[number])).join("\n") ?? ""
  );

  const primaryImage = car?.images[0]?.url ?? "";
  const galleryImages = car?.images.slice(1).map((image) => image.url) ?? [];
  
  const kmDisplay = useMemo(() => {
    if (!kmDigits) return "";
    return new Intl.NumberFormat("pt-BR").format(Number(kmDigits));
  }, [kmDigits]);

  const priceDisplay = useMemo(() => {
    if (!priceDigits) return "";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(priceDigits) / 100);
  }, [priceDigits]);

  const priceValue = priceDigits ? (Number(priceDigits) / 100).toFixed(2) : "";

  const selectedFeatures = useMemo(() => {
    const unique = new Set<string>();
    const items = [...selectedPresetFeatures, ...customFeatures.split(/\r?\n|,/)]
      .map((item) => item.trim())
      .filter(Boolean);

    return items.filter((item) => {
      const normalized = item.toLocaleLowerCase("pt-BR");
      if (unique.has(normalized)) return false;
      unique.add(normalized);
      return true;
    });
  }, [customFeatures, selectedPresetFeatures]);

  const handleKmChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setKmDigits(digits);
    if (errors.km) setErrors((prev) => ({ ...prev, km: "" }));
  };

  const handlePriceChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    setPriceDigits(digits);
    if (errors.price) setErrors((prev) => ({ ...prev, price: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: Record<string, string> = {};
    
    const requiredFields = ["title", "brand", "model", "year"];
    requiredFields.forEach(field => {
      if (!String(formData.get(field) ?? "").trim()) {
        nextErrors[field] = "Campo obrigatório.";
      }
    });

    if (!kmDigits) nextErrors.km = "Informe a quilometragem.";
    if (!priceDigits) nextErrors.price = "Informe o valor.";
    
    const description = String(formData.get("description") ?? "").trim();
    if (description.length < 20) {
      nextErrors.description = "A descrição precisa ter ao menos 20 caracteres.";
    }

    if (!String(formData.get("selectedPrimaryImage") ?? "").trim()) {
      nextErrors.images = "Selecione ao menos uma imagem principal.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      const firstError = document.querySelector('.field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const togglePresetFeature = (feature: string) => {
    setSelectedPresetFeatures((current) =>
      current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]
    );
  };

  return (
    <form action={action} className="stack" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="carId" defaultValue={car?.id ?? ""} />
      <input type="hidden" name="km" value={kmDigits} />
      <input type="hidden" name="price" value={priceValue} />
      <input type="hidden" name="features" value={selectedFeatures.join("\n")} />

      <div className="admin-card stack" style={{ gap: '32px' }}>
        {/* Seção 1: Informações Básicas */}
        <section className="form-section">
          <h3 className="form-section-title">Informações Básicas</h3>
          <div className="field-grid two">
            <div className="field">
              <label htmlFor="title">Título do Anúncio</label>
              <input id="title" name="title" defaultValue={car?.title ?? ""} placeholder="Ex: Porsche 911 Carrera S 2023" required aria-invalid={Boolean(errors.title)} />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>
            <div className="field">
              <label htmlFor="status">Status de Venda</label>
              <select id="status" name="status" defaultValue={(car?.status ?? "AVAILABLE") as CarStatus}>
                <option value="AVAILABLE">Disponível</option>
                <option value="RESERVED">Reservado</option>
                <option value="SOLD">Vendido</option>
              </select>
            </div>
          </div>

          <div className="field-grid three" style={{ marginTop: '16px' }}>
            <div className="field">
              <label htmlFor="brand">Marca</label>
              <input id="brand" name="brand" defaultValue={car?.brand ?? ""} placeholder="Ex: Porsche" required aria-invalid={Boolean(errors.brand)} />
              {errors.brand && <span className="field-error">{errors.brand}</span>}
            </div>
            <div className="field">
              <label htmlFor="model">Modelo</label>
              <input id="model" name="model" defaultValue={car?.model ?? ""} placeholder="Ex: 911 Carrera S" required aria-invalid={Boolean(errors.model)} />
              {errors.model && <span className="field-error">{errors.model}</span>}
            </div>
            <div className="field">
              <label htmlFor="year">Ano</label>
              <input id="year" name="year" type="number" defaultValue={car?.year ?? ""} placeholder="Ex: 2023" required aria-invalid={Boolean(errors.year)} />
              {errors.year && <span className="field-error">{errors.year}</span>}
            </div>
          </div>
        </section>

        {/* Seção 2: Detalhes Técnicos e Preço */}
        <section className="form-section">
          <h3 className="form-section-title">Detalhes Técnicos & Preço</h3>
          <div className="field-grid three">
            <div className="field">
              <label htmlFor="km">Quilometragem</label>
              <div className="input-with-suffix">
                <input
                  id="km"
                  name="kmDisplay"
                  type="text"
                  inputMode="numeric"
                  value={kmDisplay}
                  onChange={(e) => handleKmChange(e.target.value)}
                  placeholder="0"
                  required
                  aria-invalid={Boolean(errors.km)}
                />
                <span className="input-suffix">km</span>
              </div>
              {errors.km && <span className="field-error">{errors.km}</span>}
            </div>
            <div className="field">
              <label htmlFor="price">Preço de Venda</label>
              <div className="input-with-prefix">
                <span className="input-prefix">R$</span>
                <input
                  id="price"
                  name="priceDisplay"
                  type="text"
                  inputMode="numeric"
                  value={priceDisplay}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0,00"
                  required
                  aria-invalid={Boolean(errors.price)}
                />
              </div>
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
            <div className="field">
              <label htmlFor="fuel">Combustível</label>
              <input id="fuel" name="fuel" defaultValue={car?.fuel ?? ""} placeholder="Ex: Gasolina" />
            </div>
          </div>

          <div className="field-grid two" style={{ marginTop: '16px' }}>
            <div className="field">
              <label htmlFor="transmission">Câmbio / Transmissão</label>
              <input id="transmission" name="transmission" defaultValue={car?.transmission ?? ""} placeholder="Ex: PDK 8 marchas" />
            </div>
            <div className="field">
              <label htmlFor="whatsappLink">Link Direto WhatsApp</label>
              <input
                id="whatsappLink"
                name="whatsappLink"
                type="url"
                defaultValue={car?.whatsappLink ?? "https://wa.me/5551999866578"}
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
        </section>

        {/* Seção 3: Descrição e Tags */}
        <section className="form-section">
          <h3 className="form-section-title">Conteúdo do Anúncio</h3>
          <div className="field">
            <label htmlFor="description">Descrição Detalhada</label>
            <textarea
              id="description"
              name="description"
              defaultValue={car?.description ?? ""}
              placeholder="Descreva os detalhes, histórico e diferenciais do veículo..."
              required
              aria-invalid={Boolean(errors.description)}
              style={{ minHeight: '180px' }}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>
          <div className="field" style={{ marginTop: '16px' }}>
            <label htmlFor="tags">Tags de Busca (uma por linha)</label>
            <textarea 
              id="tags" 
              name="tags" 
              defaultValue={car?.tags.join("\n") ?? ""} 
              placeholder="Ex: Unico Dono&#10;IPVA Pago&#10;Garantia de Fabrica"
              style={{ minHeight: '100px' }}
            />
          </div>
        </section>

        {/* Seção 4: Opcionais Categorizados */}
        <section className="form-section">
          <div className="feature-picker-head">
            <div>
              <h3 className="form-section-title" style={{ marginBottom: '4px' }}>Opcionais do Veículo</h3>
              <p className="muted" style={{ fontSize: '0.85rem' }}>Selecione os itens presentes no veículo para facilitar a busca do cliente.</p>
            </div>
            <span className="feature-picker-count">{selectedFeatures.length} selecionado(s)</span>
          </div>

          <div className="feature-categories-stack" style={{ display: 'grid', gap: '24px', marginTop: '20px' }}>
            {CAR_FEATURE_CATEGORIES.map((category) => (
              <div key={category.name} className="feature-category-group">
                <h4 className="feature-category-label">{category.name}</h4>
                <div className="feature-picker-grid">
                  {category.options.map((feature) => {
                    const checked = selectedPresetFeatures.includes(feature);
                    return (
                      <label key={feature} className={`feature-option${checked ? " is-selected" : ""}`}>
                        <input type="checkbox" checked={checked} onChange={() => togglePresetFeature(feature)} />
                        <span>{feature}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="field" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--line)' }}>
            <label htmlFor="customFeatures">Outros Opcionais (Customizados)</label>
            <textarea
              id="customFeatures"
              name="customFeatures"
              value={customFeatures}
              onChange={(e) => setCustomFeatures(e.target.value)}
              placeholder="Adicione outros itens separados por linha ou vírgula..."
              style={{ minHeight: '80px' }}
            />
          </div>
        </section>

        {/* Seção 5: Galeria de Imagens */}
        <section className="form-section">
          <h3 className="form-section-title">Galeria de Fotos</h3>
          <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
            A primeira imagem selecionada será a capa do anúncio.
          </p>
          <RepositoryImagePicker
            images={availableImages}
            initialPrimary={primaryImage}
            initialGallery={galleryImages}
            primaryInputName="selectedPrimaryImage"
            galleryInputName="selectedGalleryImages"
            emptyMessage="Selecione as fotos do veículo no repositório."
          />
          {errors.images && <span className="field-error">{errors.images}</span>}
        </section>

        <div className="field">
          <label className="checkbox-field">
            <input type="checkbox" name="isFeatured" defaultChecked={car?.isFeatured ?? false} />
            <span className="checkbox-label">Destacar este veículo na página inicial</span>
          </label>
        </div>
      </div>

      <div className="admin-footer-actions">
        <div className="container inline-actions" style={{ justifyContent: 'flex-end', padding: '24px 0' }}>
          {car && (
            <div className="muted" style={{ alignSelf: "center", marginRight: 'auto' }}>
              Valor atual: <strong>{formatCurrency(car.priceCents)}</strong>
            </div>
          )}
          <AdminSubmitButton
            className="button-primary"
            idleLabel={car ? "Salvar Alterações" : "Publicar Veículo"}
            pendingLabel={car ? "Salvando..." : "Publicando..."}
          />
        </div>
      </div>
      <AdminPendingState copy="Processando informações do veículo..." />
    </form>
  );
}
