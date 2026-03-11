"use client";

import { ProductCategory } from "@prisma/client";
import { useState } from "react";
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

  return (
    <form action={action} className="stack">
      <input type="hidden" name="productId" defaultValue={product?.id ?? ""} />
      <input type="hidden" name="category" value={category} />

      <div className="admin-card stack">
        <div className="field-grid two">
          <div className="field">
            <label htmlFor="name">Nome do produto</label>
            <input id="name" name="name" defaultValue={product?.name ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="price">Preco (BRL)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""}
              required
            />
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
          <textarea id="description" name="description" defaultValue={product?.description ?? ""} required />
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
            />
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
            />
          </div>
        )}

        <label style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} />
          Marcar como destaque
        </label>
      </div>

      <div className="inline-actions">
        <button type="submit" className="button-primary">
          {product ? "Salvar produto" : "Criar produto"}
        </button>
        {product ? (
          <div className="muted" style={{ alignSelf: "center" }}>
            Preco atual: {formatCurrency(product.priceCents)}
          </div>
        ) : null}
      </div>
    </form>
  );
}
