"use server";

import { getProductById } from "@/lib/data";
import { getAvailableStock } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { assertSameOriginActionRequest, consumeRateLimit, getActionRequestFingerprint } from "@/lib/security";
import { purchaseRequestSchema } from "@/lib/validators";

export type PurchaseRequestState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitPurchaseRequestAction(
  _previousState: PurchaseRequestState,
  formData: FormData
): Promise<PurchaseRequestState> {
  try {
    await assertSameOriginActionRequest();
  } catch {
    return {
      status: "error",
      message: "A solicitacao foi bloqueada por seguranca."
    };
  }

  const rateLimitKey = await getActionRequestFingerprint("purchase-request", String(formData.get("productId") ?? ""));
  const purchaseRateLimit = consumeRateLimit(rateLimitKey, {
    limit: 12,
    windowMs: 10 * 60 * 1000
  });

  if (!purchaseRateLimit.allowed) {
    return {
      status: "error",
      message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente."
    };
  }

  const parsed = purchaseRequestSchema.safeParse({
    productId: formData.get("productId"),
    quantity: Number.parseInt(String(formData.get("quantity") ?? "1"), 10),
    size: String(formData.get("size") ?? "").trim() || null,
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address")
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Revise os campos obrigatorios."
    };
  }

  const product = await getProductById(parsed.data.productId);
  if (!product) {
    return {
      status: "error",
      message: "Produto nao encontrado."
    };
  }

  const availableStock = getAvailableStock(product, parsed.data.size);
  if (availableStock < parsed.data.quantity) {
    return {
      status: "error",
      message: "A quantidade solicitada excede o estoque disponivel."
    };
  }

  if (product.category === "APPAREL" && !parsed.data.size) {
    return {
      status: "error",
      message: "Selecione um tamanho valido para continuar."
    };
  }

  try {
    await prisma.order.create({
      data: {
        customerName: parsed.data.fullName,
        customerEmail: parsed.data.email,
        customerPhone: parsed.data.phone,
        customerAddress: parsed.data.address,
        productId: product.id,
        productNameSnapshot: product.name,
        productCategorySnapshot: product.categoryLabel,
        productPriceSnapshot: product.priceCents,
        quantity: parsed.data.quantity,
        selectedSize: parsed.data.size,
        notes: null
      }
    });

    return {
      status: "success",
      message: "Pedido registrado com sucesso. A equipe da NGF Racing vai analisar a solicitacao."
    };
  } catch (error) {
    console.error("[purchase-request] create order error", error);
    return {
      status: "error",
      message: "Nao foi possivel registrar seu pedido agora. Tente novamente em instantes."
    };
  }
}
