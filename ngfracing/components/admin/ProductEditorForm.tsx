"use client";

import { ProductCategory } from "@prisma/client";
import type { FormEvent } from "react";
import { useState } from "react";
import { AdminPendingState, AdminSubmitButton } from "@/components/admin/AdminFormControls";
import { RepositoryImagePicker } from "@/components/admin/RepositoryImagePicker";
import type { RepositoryImageOption } from "@/lib/image-library";
import { serializeSizeStocks } from "@/lib/products";
import type { PublicProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  availableImages: RepositoryImageOption[];
  product?: PublicProduct | null;
};

const categoryOptions = [
  {
    value: ProductCategory.PART,
    title: "Peca",
    kicker: "Performance",
    icon: "PT",
    description: "Estoque simples para componentes e itens tecnicos.",
    meta: "Quantidade unica e controle direto no cadastro."
  },
  {
    value: ProductCategory.APPAREL,
    title: "Roupa",
    kicker: "Grade",
    icon: "AP",
    description: "Tamanhos e quantidades separados por grade.",
    meta: "Ideal para camisetas, moletons e uniformes."
  },
  {
    value: ProductCategory.ACCESSORY,
    title: "Acessorio",
    kicker: "Lifestyle",
    icon: "AC",
    description: "Estoque simples para bones, chaveiros e afins.",
    meta: "Fluxo rapido para itens de giro e merchandising."
  }
];

export function ProductEditorForm({ action, availableImages, product }: Props) {
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? ProductCategory.PART);
  const [priceDigits, setPriceDigits] = useState(product ? String(product.priceCents) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priceDisplay = priceDigits
    ? new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Number(priceDigits) / 100)
    : "";
  const priceValue = priceDigits ? (Number(priceDigits) / 100).toFixed(2) : "";

  const handlePriceChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    setPriceDigits(digits);
    if (errors.price) {
      setErrors((previous) => ({ ...previous, price: "" }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const selectedPrimaryImage = String(formData.get("selectedPrimaryImage") ?? "").trim();
    const sizeStocks = String(formData.get("sizeStocks") ?? "").trim();
    const stockQuantity = String(formData.get("stockQuantity") ?? "").trim();

    if (!name) {
      nextErrors.name = "Informe o nome do produto.";
    }
    if (!priceDigits) {
      nextErrors.price = "Informe o preco do produto.";
    }
    if (description.length < 10) {
      nextErrors.description = "A descricao precisa ter ao menos 10 caracteres.";
    }
    if (!selectedPrimaryImage) {
      nextErrors.images = "Selecione uma imagem principal.";
    }
    if (category === ProductCategory.APPAREL && !sizeStocks) {
      nextErrors.sizeStocks = "Informe ao menos um tamanho com estoque.";
    }
    if (category !== ProductCategory.APPAREL && (stockQuantity === "" || Number(stockQuantity) < 0)) {
      nextErrors.stockQuantity = "Informe o estoque disponivel.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
    }
  };

  return (
    <form action={action} className="stack" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="productId" defaultValue={product?.id ?? ""} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="price" value={priceValue} />

      <div className="admin-card stack">
        <div className="field-grid two">
          <div className="field">
            <label htmlFor="name">Nome do produto</label>
            <input id="name" name="name" defaultValue={product?.name ?? ""} required aria-invalid={Boolean(errors.name)} />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
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
                placeholder="0,00"
                value={priceDisplay}
                onChange={(event) => handlePriceChange(event.target.value)}
                required
                aria-invalid={Boolean(errors.price)}
              />
            </div>
            {errors.price ? <span className="field-error">{errors.price}</span> : null}
          </div>
        </div>

        <div className="stack">
          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Categoria</label>
            <p className="muted" style={{ margin: "0 0 14px" }}>
              Escolha o tipo de produto para liberar o bloco correto de estoque no formulario.
            </p>
            <div className="category-card-grid">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`category-card ${category === option.value ? "is-active" : ""}`}
                  onClick={() => setCategory(option.value)}
                >
                  <span className="category-card-kicker">{option.kicker}</span>
                  <div className="category-card-title-row">
                    <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{option.title}</div>
                    <span className="category-card-icon" aria-hidden="true">
                      {option.icon}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: "0.9rem", marginTop: 10 }}>
                    {option.description}
                  </div>
                  <div className="category-card-meta">{option.meta}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Descricao</label>
          <textarea
            id="description"
            name="description"
            defaultValue={product?.description ?? ""}
            required
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? <span className="field-error">{errors.description}</span> : null}
        </div>

        <div className="stack">
          <div>
            <h3 style={{ marginBottom: 8 }}>Imagens do repositorio</h3>
            <p className="muted" style={{ margin: 0 }}>
              Escolha uma imagem principal e fotos adicionais a partir dos arquivos presentes em `public/images/produtos`.
            </p>
          </div>
          <RepositoryImagePicker
            images={availableImages}
            initialPrimary={product?.primaryImageUrl ?? ""}
            initialGallery={product?.images.slice(1).map((image) => image.url) ?? []}
            primaryInputName="selectedPrimaryImage"
            galleryInputName="selectedGalleryImages"
            emptyMessage="Selecione uma imagem principal para o produto."
          />
          {errors.images ? <span className="field-error">{errors.images}</span> : null}
        </div>

        {category === ProductCategory.APPAREL ? (
          <div className="field">
            <label htmlFor="sizeStocks">Estoque por tamanho</label>
            <textarea
              id="sizeStocks"
              name="sizeStocks"
              defaultValue={serializeSizeStocks(product?.sizeStocks ?? [])}
              placeholder={"PP:2\nP:5\nM:4\nG:3\nGG:1"}
              required
              aria-invalid={Boolean(errors.sizeStocks)}
            />
            {errors.sizeStocks ? <span className="field-error">{errors.sizeStocks}</span> : null}
          </div>
        ) : (
          <div className="field">
            <label htmlFor="stockQuantity">Estoque disponivel</label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              defaultValue={product?.stockQuantity ?? ""}
              required
              aria-invalid={Boolean(errors.stockQuantity)}
            />
            {errors.stockQuantity ? <span className="field-error">{errors.stockQuantity}</span> : null}
          </div>
        )}

        <label style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} />
          Marcar como destaque
        </label>
      </div>

      <div className="inline-actions">
        <AdminSubmitButton
          className="button-primary"
          idleLabel={product ? "Salvar produto" : "Criar produto"}
          pendingLabel={product ? "Salvando produto..." : "Criando produto..."}
        />
        {product ? (
          <div className="muted" style={{ alignSelf: "center" }}>
            Preco atual: {formatCurrency(product.priceCents)}
          </div>
        ) : null}
      </div>
      <AdminPendingState copy="Processando cadastro do produto..." />
    </form>
  );
}
