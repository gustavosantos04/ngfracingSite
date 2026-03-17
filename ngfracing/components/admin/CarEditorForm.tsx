"use client";

import type { CarStatus } from "@prisma/client";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { AdminPendingState, AdminSubmitButton } from "@/components/admin/AdminFormControls";
import { RepositoryImagePicker } from "@/components/admin/RepositoryImagePicker";
import { CAR_FEATURE_OPTIONS } from "@/lib/constants";
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
    if (!kmDigits) {
      return "";
    }

    return new Intl.NumberFormat("pt-BR").format(Number(kmDigits));
  }, [kmDigits]);
  const priceDisplay = useMemo(() => {
    if (!priceDigits) {
      return "";
    }

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
      if (unique.has(normalized)) {
        return false;
      }

      unique.add(normalized);
      return true;
    });
  }, [customFeatures, selectedPresetFeatures]);

  const handleKmChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setKmDigits(digits);
    if (errors.km) {
      setErrors((previous) => ({ ...previous, km: "" }));
    }
  };

  const handlePriceChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    setPriceDigits(digits);
    if (errors.price) {
      setErrors((previous) => ({ ...previous, price: "" }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: Record<string, string> = {};
    const title = String(formData.get("title") ?? "").trim();
    const brand = String(formData.get("brand") ?? "").trim();
    const model = String(formData.get("model") ?? "").trim();
    const year = String(formData.get("year") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const selectedPrimaryImage = String(formData.get("selectedPrimaryImage") ?? "").trim();

    if (!title) {
      nextErrors.title = "Informe o titulo do carro.";
    }
    if (!brand) {
      nextErrors.brand = "Informe a marca.";
    }
    if (!model) {
      nextErrors.model = "Informe o modelo.";
    }
    if (!year) {
      nextErrors.year = "Informe o ano.";
    }
    if (!kmDigits) {
      nextErrors.km = "Informe a quilometragem.";
    }
    if (!priceDigits) {
      nextErrors.price = "Informe o valor.";
    }
    if (description.length < 20) {
      nextErrors.description = "A descricao precisa ter ao menos 20 caracteres.";
    }
    if (!selectedPrimaryImage) {
      nextErrors.images = "Selecione ao menos uma imagem principal.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
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

      <div className="admin-card stack">
        <div className="field-grid two">
          <div className="field">
            <label htmlFor="title">Titulo</label>
            <input id="title" name="title" defaultValue={car?.title ?? ""} required aria-invalid={Boolean(errors.title)} />
            {errors.title ? <span className="field-error">{errors.title}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="whatsappLink">Link do WhatsApp</label>
            <input
              id="whatsappLink"
              name="whatsappLink"
              type="url"
              defaultValue={car?.whatsappLink ?? "https://wa.me/5551999866578"}
              required
              aria-invalid={Boolean(errors.whatsappLink)}
            />
            {errors.whatsappLink ? <span className="field-error">{errors.whatsappLink}</span> : null}
          </div>
        </div>

        <div className="field-grid three">
          <div className="field">
            <label htmlFor="brand">Marca</label>
            <input id="brand" name="brand" defaultValue={car?.brand ?? ""} required aria-invalid={Boolean(errors.brand)} />
            {errors.brand ? <span className="field-error">{errors.brand}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="model">Modelo</label>
            <input id="model" name="model" defaultValue={car?.model ?? ""} required aria-invalid={Boolean(errors.model)} />
            {errors.model ? <span className="field-error">{errors.model}</span> : null}
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
            <input id="year" name="year" type="number" defaultValue={car?.year ?? ""} required aria-invalid={Boolean(errors.year)} />
            {errors.year ? <span className="field-error">{errors.year}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="km">KM</label>
            <div className="input-with-suffix">
              <input
                id="km"
                name="kmDisplay"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={kmDisplay}
                onChange={(event) => handleKmChange(event.target.value)}
                placeholder="0"
                required
                aria-invalid={Boolean(errors.km)}
              />
              <span className="input-suffix">km</span>
            </div>
            {errors.km ? <span className="field-error">{errors.km}</span> : null}
          </div>
          <div className="field">
            <label htmlFor="price">Preco (BRL)</label>
            <div className="input-with-prefix">
              <span className="input-prefix">R$</span>
              <input
                id="price"
                name="priceDisplay"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={priceDisplay}
                onChange={(event) => handlePriceChange(event.target.value)}
                placeholder="0,00"
                required
                aria-invalid={Boolean(errors.price)}
              />
            </div>
            {errors.price ? <span className="field-error">{errors.price}</span> : null}
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
          <textarea
            id="description"
            name="description"
            defaultValue={car?.description ?? ""}
            required
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? <span className="field-error">{errors.description}</span> : null}
        </div>

        <div className="field-grid two">
          <div className="feature-picker-panel">
            <div className="feature-picker-head">
              <div>
                <span className="feature-picker-title">Opcionais</span>
                <p className="muted feature-picker-copy">
                  Marque os opcionais mais comuns e adicione itens customizados somente quando precisar.
                </p>
              </div>
              <span className="feature-picker-count">{selectedFeatures.length} selecionado(s)</span>
            </div>

            <div className="feature-picker-grid" role="group" aria-label="Lista de opcionais pre-definidos">
              {CAR_FEATURE_OPTIONS.map((feature) => {
                const checked = selectedPresetFeatures.includes(feature);

                return (
                  <label key={feature} className={`feature-option${checked ? " is-selected" : ""}`}>
                    <input type="checkbox" checked={checked} onChange={() => togglePresetFeature(feature)} />
                    <span>{feature}</span>
                  </label>
                );
              })}
            </div>

            <div className="field">
              <label htmlFor="customFeatures">Opcionais customizados</label>
              <textarea
                id="customFeatures"
                name="customFeatures"
                value={customFeatures}
                onChange={(event) => setCustomFeatures(event.target.value)}
                placeholder={"Ex.: Suspensao preparada\nVolante multifuncional"}
              />
            </div>

            {selectedFeatures.length > 0 ? (
              <div className="feature-preview">
                {selectedFeatures.map((feature) => (
                  <span key={feature} className="feature-preview-chip">
                    {feature}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="tags">Tags (uma por linha)</label>
            <textarea id="tags" name="tags" defaultValue={car?.tags.join("\n") ?? ""} />
          </div>
        </div>

        <div className="stack">
          <div>
            <h3 style={{ marginBottom: 8 }}>Imagens do repositorio</h3>
            <p className="muted" style={{ margin: 0 }}>
              Escolha uma imagem principal e monte a galeria a partir dos arquivos presentes em `public/images/carros`.
            </p>
          </div>
          <RepositoryImagePicker
            images={availableImages}
            initialPrimary={primaryImage}
            initialGallery={galleryImages}
            primaryInputName="selectedPrimaryImage"
            galleryInputName="selectedGalleryImages"
            emptyMessage="Selecione uma imagem principal para o carro."
          />
          {errors.images ? <span className="field-error">{errors.images}</span> : null}
        </div>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <input type="checkbox" name="isFeatured" defaultChecked={car?.isFeatured ?? false} />
          Marcar como destaque
        </label>
      </div>

      <div className="inline-actions">
        <AdminSubmitButton
          className="button-primary"
          idleLabel={car ? "Salvar alteracoes" : "Criar carro"}
          pendingLabel={car ? "Salvando alteracoes..." : "Criando carro..."}
        />
        {car ? (
          <div className="muted" style={{ alignSelf: "center" }}>
            Preco atual: {formatCurrency(car.priceCents)}
          </div>
        ) : null}
      </div>
      <AdminPendingState copy="Processando cadastro do carro..." />
    </form>
  );
}
