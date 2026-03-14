"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { RepositoryImageOption } from "@/lib/image-library";
import { sharedImageBlurDataUrl } from "@/lib/images";

type Props = {
  images: RepositoryImageOption[];
  initialPrimary?: string;
  initialGallery?: string[];
  primaryInputName: string;
  galleryInputName: string;
  emptyMessage: string;
};

const INITIAL_VISIBLE_IMAGES = 12;
const LOAD_MORE_IMAGES = 12;

function normalizeGroupLabel(group: string) {
  if (group.includes("images/carros")) {
    return "Biblioteca principal de carros";
  }

  if (group.includes("images/produtos")) {
    return "Biblioteca principal de produtos";
  }

  if (group === "cars") {
    return "Biblioteca legada";
  }

  if (group === "current-selection") {
    return "Selecao atual";
  }

  return group;
}

export function RepositoryImagePicker({
  images,
  initialPrimary = "",
  initialGallery = [],
  primaryInputName,
  galleryInputName,
  emptyMessage
}: Props) {
  const [primaryImage, setPrimaryImage] = useState(initialPrimary);
  const [galleryImages, setGalleryImages] = useState<string[]>(initialGallery);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_IMAGES);
  const catalogImages = useMemo(() => {
    const base = new Map(images.map((image) => [image.url, image]));
    const selectedUrls = [initialPrimary, ...initialGallery].filter((url): url is string => Boolean(url));

    for (const url of selectedUrls) {
      if (!base.has(url)) {
        const label = url.split("/").pop() ?? "imagem-selecionada";
        base.set(url, {
          url,
          label,
          group: "current-selection"
        });
      }
    }

    return Array.from(base.values());
  }, [images, initialGallery, initialPrimary]);
  const groups = useMemo(() => Array.from(new Set(catalogImages.map((image) => image.group))), [catalogImages]);
  const [activeGroup, setActiveGroup] = useState(groups[0] ?? "all");

  useEffect(() => {
    if (!primaryImage && images[0]) {
      setPrimaryImage(images[0].url);
    }
  }, [images, primaryImage]);

  useEffect(() => {
    if (groups.length && !groups.includes(activeGroup)) {
      setActiveGroup(groups[0]);
    }
  }, [activeGroup, groups]);

  const gallerySet = useMemo(() => new Set(galleryImages), [galleryImages]);
  const searchTerm = search.trim().toLowerCase();

  const filteredImages = useMemo(
    () =>
      catalogImages.filter((image) => {
        const matchesGroup = activeGroup === "all" ? true : image.group === activeGroup;
        const matchesSearch =
          !searchTerm ||
          image.label.toLowerCase().includes(searchTerm) ||
          normalizeGroupLabel(image.group).toLowerCase().includes(searchTerm);

        return matchesGroup && matchesSearch;
      }),
    [activeGroup, catalogImages, searchTerm]
  );

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_IMAGES);
  }, [activeGroup, searchTerm]);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const hasMoreImages = filteredImages.length > visibleImages.length;

  const selectedGalleryItems = useMemo(
    () =>
      galleryImages.map((url) => catalogImages.find((image) => image.url === url)).filter(Boolean) as RepositoryImageOption[],
    [catalogImages, galleryImages]
  );

  const primaryItem = catalogImages.find((image) => image.url === primaryImage) ?? null;

  const toggleGalleryImage = (url: string) => {
    setGalleryImages((current) =>
      current.includes(url) ? current.filter((item) => item !== url) : [...current, url]
    );
  };

  return (
    <div className="stack">
      <input type="hidden" name={primaryInputName} value={primaryImage} />
      {galleryImages.map((url) => (
        <input key={url} type="hidden" name={galleryInputName} value={url} />
      ))}

      <div className="picker-summary-grid">
        <section className="admin-card picker-focus-card stack">
          <div className="picker-section-head">
            <div>
              <h3 style={{ margin: 0 }}>Imagem principal</h3>
              <p className="muted picker-caption">A foto que representa o carro ou produto no site.</p>
            </div>
            <button type="button" className="button-ghost picker-inline-button" onClick={() => setPrimaryImage("")}>
              Limpar
            </button>
          </div>
          {primaryItem ? (
            <div className="picker-focus-preview">
              <Image
                src={primaryItem.url}
                alt={primaryItem.label}
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
                placeholder="blur"
                blurDataURL={sharedImageBlurDataUrl}
                style={{ objectFit: "cover" }}
              />
              <div className="picker-focus-meta">
                <strong>{primaryItem.label}</strong>
                <span>{normalizeGroupLabel(primaryItem.group)}</span>
              </div>
            </div>
          ) : (
            <div className="picker-empty-state">{emptyMessage}</div>
          )}
        </section>

        <section className="admin-card picker-focus-card stack">
          <div className="picker-section-head">
            <div>
              <h3 style={{ margin: 0 }}>Galeria</h3>
              <p className="muted picker-caption">Selecione quantas imagens extras fizerem sentido para a pagina interna.</p>
            </div>
            <button type="button" className="button-ghost picker-inline-button" onClick={() => setGalleryImages([])}>
              Limpar
            </button>
          </div>
          {selectedGalleryItems.length ? (
            <div className="picker-gallery-strip">
              {selectedGalleryItems.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  className="picker-gallery-chip"
                  onClick={() => toggleGalleryImage(image.url)}
                >
                  <span className="picker-gallery-chip-media">
                    <Image
                      src={image.url}
                      alt={image.label}
                      fill
                      sizes="92px"
                      placeholder="blur"
                      blurDataURL={sharedImageBlurDataUrl}
                      style={{ objectFit: "cover" }}
                    />
                  </span>
                  <span className="picker-gallery-chip-copy">
                    <strong>{image.label}</strong>
                    <span>Remover da galeria</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="picker-empty-state">Nenhuma imagem adicional selecionada.</div>
          )}
        </section>
      </div>

      <section className="admin-card stack">
        <div className="picker-section-head">
          <div>
            <h3 style={{ margin: 0 }}>Biblioteca de imagens</h3>
            <p className="muted picker-caption">Busque e filtre a biblioteca para montar a principal e a galeria sem poluicao visual.</p>
          </div>
          <div className="picker-counter">{filteredImages.length} arquivo(s)</div>
        </div>

        <div className="picker-toolbar">
          <div className="field" style={{ minWidth: 0 }}>
            <label htmlFor="repository-image-search">Buscar imagem</label>
            <input
              id="repository-image-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome do arquivo ou biblioteca"
            />
          </div>
          <div className="picker-tabs" role="tablist" aria-label="Filtros da biblioteca">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                role="tab"
                aria-selected={activeGroup === group}
                className={`picker-tab ${activeGroup === group ? "is-active" : ""}`}
                onClick={() => setActiveGroup(group)}
              >
                {normalizeGroupLabel(group)}
              </button>
            ))}
          </div>
        </div>

        {visibleImages.length ? (
          <>
            <div className="picker-library-grid">
              {visibleImages.map((image) => {
                const isPrimary = primaryImage === image.url;
                const isGallery = gallerySet.has(image.url);

                return (
                  <article
                    key={image.url}
                    className={`picker-library-card ${isPrimary ? "is-primary" : ""} ${isGallery ? "is-gallery" : ""}`}
                  >
                    <div className="picker-library-media">
                      <Image
                        src={image.url}
                        alt={image.label}
                        fill
                        sizes="(max-width: 900px) 50vw, 20vw"
                        placeholder="blur"
                        blurDataURL={sharedImageBlurDataUrl}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="picker-library-badges">
                        {isPrimary ? <span className="picker-flag picker-flag-primary">Principal</span> : null}
                        {isGallery ? <span className="picker-flag picker-flag-gallery">Galeria</span> : null}
                      </div>
                    </div>
                    <div className="picker-library-body">
                      <div className="picker-library-copy">
                        <strong>{image.label}</strong>
                        <span>{normalizeGroupLabel(image.group)}</span>
                      </div>
                      <div className="picker-library-actions">
                        <button
                          type="button"
                          className={isPrimary ? "button-primary picker-action-button" : "button-secondary picker-action-button"}
                          onClick={() => setPrimaryImage(image.url)}
                        >
                          {isPrimary ? "Imagem principal" : "Definir principal"}
                        </button>
                        <button
                          type="button"
                          className={isGallery ? "button-primary picker-action-button" : "button-ghost picker-action-button"}
                          onClick={() => toggleGalleryImage(image.url)}
                        >
                          {isGallery ? "Na galeria" : "Adicionar galeria"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {hasMoreImages ? (
              <div className="picker-load-more-wrap">
                <button
                  type="button"
                  className="button-secondary picker-load-more"
                  onClick={() => setVisibleCount((current) => current + LOAD_MORE_IMAGES)}
                >
                  Carregar mais
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="picker-empty-state">Nenhuma imagem encontrada com os filtros atuais.</div>
        )}
      </section>
    </div>
  );
}
