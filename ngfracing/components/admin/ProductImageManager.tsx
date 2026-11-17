"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { RepositoryImageOption } from "@/lib/image-library";
import { MAX_PRODUCT_IMAGES, moveProductImage, PRODUCT_IMAGE_TYPES, validateProductImageFile } from "@/lib/product-images";

type GalleryImage = { id: string; url: string; label: string; file?: File; error?: string };
type Props = {
  availableImages: RepositoryImageOption[];
  initialImages: string[];
  onBlockedChange: (blocked: boolean) => void;
};

export function ProductImageManager({ availableImages, initialImages, onBlockedChange }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(() => [...new Set(initialImages.filter(Boolean))].map((url) => ({
    id: url, url, label: url.split("/").pop() || "Imagem do produto"
  })));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const previews = useRef(new Set<string>());
  const uploadLock = useRef(false);
  const { pending } = useFormStatus();
  const hasUnsentFiles = images.some((image) => image.file);

  useEffect(() => { onBlockedChange(uploading || hasUnsentFiles); }, [uploading, hasUnsentFiles, onBlockedChange]);
  useEffect(() => {
    const urls = previews.current;
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, []);

  const addFiles = (files: File[]) => {
    setError("");
    if (files.length + images.length > MAX_PRODUCT_IMAGES) {
      setError(`Selecione no máximo ${MAX_PRODUCT_IMAGES} imagens por produto.`);
      return;
    }
    const invalid = files.map((file) => validateProductImageFile(file)).find(Boolean);
    if (invalid) { setError(invalid); return; }
    const additions = files.map((file) => {
      const url = URL.createObjectURL(file);
      previews.current.add(url);
      return { id: crypto.randomUUID(), url, label: file.name, file };
    });
    setImages((current) => [...current, ...additions]);
  };

  const uploadImages = async () => {
    if (uploadLock.current) return;
    uploadLock.current = true;
    setUploading(true);
    setError("");
    try {
      // One file per request stays below Vercel's request limit and isolates partial failures.
      for (const image of images.filter((item) => item.file)) {
        try {
          const body = new FormData();
          body.append("file", image.file!);
          const response = await fetch("/api/products/images", { method: "POST", body });
          const result = await response.json().catch(() => null);
          if (!response.ok || typeof result?.url !== "string") {
            throw new Error(result?.error || "Falha no upload. Tente novamente.");
          }
          setImages((current) => current.map((item) => item.id === image.id ? {
            id: item.id, url: result.url, label: item.label
          } : item));
          URL.revokeObjectURL(image.url);
          previews.current.delete(image.url);
        } catch (failure) {
          setImages((current) => current.map((item) => item.id === image.id ? {
            ...item, error: failure instanceof Error ? failure.message : "Falha no upload. Tente novamente."
          } : item));
        }
      }
    } finally {
      uploadLock.current = false;
      setUploading(false);
    }
  };

  const removeImage = (image: GalleryImage) => {
    setImages((current) => current.filter((item) => item.id !== image.id));
    if (image.file) {
      URL.revokeObjectURL(image.url);
      previews.current.delete(image.url);
    }
    setError("");
  };

  return (
    <fieldset className="product-image-manager stack" disabled={pending || uploading} aria-busy={uploading}>
      <legend>Imagens do produto</legend>
      <p className="muted picker-caption">
        Até {MAX_PRODUCT_IMAGES} imagens. JPG, PNG, WebP ou AVIF, até 4 MiB cada. A primeira é a principal.
        Confira as prévias e envie os arquivos antes de salvar o produto.
      </p>
      <input type="hidden" name="selectedPrimaryImage" value={images[0]?.file ? "" : images[0]?.url ?? ""} />
      {images.slice(1).filter((image) => !image.file).map((image) => (
        <input key={image.id} type="hidden" name="selectedGalleryImages" value={image.url} />
      ))}
      <div className="field">
        <label htmlFor="product-image-files">Adicionar fotos do dispositivo</label>
        <input id="product-image-files" type="file" accept={PRODUCT_IMAGE_TYPES.join(",")} multiple
          onChange={(event) => {
            addFiles(Array.from(event.currentTarget.files ?? []));
            event.currentTarget.value = "";
          }} />
      </div>
      <div role="status" aria-live="polite">
        {uploading ? "Enviando imagens. Aguarde..." : hasUnsentFiles ? "Há imagens pendentes. Envie-as ou remova-as para salvar." :
          `${images.length}/${MAX_PRODUCT_IMAGES} imagens prontas para salvar.`}
      </div>
      {hasUnsentFiles ? <button type="button" className="button-secondary" onClick={uploadImages}>
        Enviar imagens pendentes / tentar novamente
      </button> : null}
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      {images.length ? <ol className="product-image-grid">
        {images.map((image, index) => <li key={image.id} className="admin-card stack">
          <div className="product-image-preview">
            <Image src={image.url} alt={`Prévia ${index + 1}: ${image.label}`} fill
              unoptimized={Boolean(image.file)} sizes="(max-width: 600px) 90vw, 280px" style={{ objectFit: "contain" }} />
          </div>
          <strong className="product-image-label">{index === 0 ? "Principal" : `Foto ${index + 1}`} · {image.label}</strong>
          {image.error ? <span role="alert" className="field-error">{image.error}</span> :
            <span className="muted">{image.file ? "Prévia local · pendente de envio" : "Pronta para salvar"}</span>}
          <div className="inline-actions">
            <button type="button" className="button-ghost" disabled={index === 0}
              aria-label={`Usar foto ${index + 1} como principal`}
              onClick={() => setImages((current) => moveProductImage(current, index, 0))}>Principal</button>
            <button type="button" className="button-ghost" disabled={index === 0}
              aria-label={`Mover foto ${index + 1} para antes`}
              onClick={() => setImages((current) => moveProductImage(current, index, index - 1))}>←</button>
            <button type="button" className="button-ghost" disabled={index === images.length - 1}
              aria-label={`Mover foto ${index + 1} para depois`}
              onClick={() => setImages((current) => moveProductImage(current, index, index + 1))}>→</button>
            <button type="button" className="button-ghost" aria-label={`Remover foto ${index + 1} do produto`}
              onClick={() => removeImage(image)}>Remover</button>
          </div>
        </li>)}
      </ol> : <div className="picker-empty-state">Adicione uma imagem principal para o produto.</div>}
      <details>
        <summary>Usar uma imagem da biblioteca existente</summary>
        <div className="field product-image-library">
          <label htmlFor="product-repository-image">Imagem do repositório</label>
          <select id="product-repository-image" value={repositoryUrl} onChange={(event) => setRepositoryUrl(event.target.value)}>
            <option value="">Selecione uma imagem</option>
            {availableImages.map((image) => <option key={image.url} value={image.url}>{image.label}</option>)}
          </select>
          <button type="button" className="button-secondary" disabled={!repositoryUrl} onClick={() => {
            if (images.some((image) => image.url === repositoryUrl)) { setError("Esta imagem já está na galeria."); return; }
            if (images.length >= MAX_PRODUCT_IMAGES) { setError(`Limite de ${MAX_PRODUCT_IMAGES} imagens atingido.`); return; }
            const image = availableImages.find((item) => item.url === repositoryUrl);
            if (image) setImages((current) => [...current, { id: image.url, url: image.url, label: image.label }]);
            setRepositoryUrl("");
            setError("");
          }}>Adicionar à galeria</button>
        </div>
      </details>
      <p className="muted picker-caption">As alterações da galeria só são aplicadas ao salvar o produto.
        Remover uma imagem daqui preserva o arquivo no armazenamento.</p>
    </fieldset>
  );
}
