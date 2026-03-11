"use client";

import { useActionState } from "react";
import { submitPurchaseRequestAction, type PurchaseRequestState } from "@/app/produtos/actions";

const initialState: PurchaseRequestState = {
  status: "idle",
  message: ""
};

type Props = {
  productId: string;
  quantity: number;
  size?: string | null;
};

export function PurchaseRequestForm({ productId, quantity, size }: Props) {
  const [state, formAction, isPending] = useActionState(submitPurchaseRequestAction, initialState);

  return (
    <form action={formAction} className="admin-card stack">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      <input type="hidden" name="size" value={size ?? ""} />

      {state.status !== "idle" ? (
        <div
          className="admin-card"
          style={{
            padding: 14,
            borderColor: state.status === "success" ? "rgba(23,163,74,0.35)" : "rgba(215,0,0,0.35)"
          }}
        >
          {state.message}
        </div>
      ) : null}

      <div className="field-grid two">
        <div className="field">
          <label htmlFor="fullName">Nome completo</label>
          <input id="fullName" name="fullName" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className="field-grid two">
        <div className="field">
          <label htmlFor="phone">Numero para contato</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="field">
          <label htmlFor="address">Endereco para entrega</label>
          <input id="address" name="address" autoComplete="street-address" required />
        </div>
      </div>

      <button type="submit" className="button-primary" disabled={isPending}>
        {isPending ? "Registrando..." : "Registrar pedido"}
      </button>
    </form>
  );
}
