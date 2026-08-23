import { createServerFn } from "@tanstack/react-start";

const PAYPAL_BASE = (() => {
  const mode = (process.env.PAYPAL_MODE ?? "sandbox").toLowerCase();
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
})();

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("PayPal credentials not configured");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Failed to obtain PayPal access token");
  const data = await res.json();
  return data.access_token;
}

export const getPaypalClientId = createServerFn({ method: "GET" }).handler(async () => {
  return { clientId: process.env.PAYPAL_CLIENT_ID ?? "" };
});

export const createPaypalOrder = createServerFn({ method: "POST" })
  .validator((d: { amount: string; planName: string }) => d)
  .handler(async ({ data }) => {
    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: data.amount },
            description: `Qumra Academy — ${data.planName}`,
          },
        ],
        application_context: {
          brand_name: "Qumra Academy",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal create order failed: ${err}`);
    }
    const order = await res.json();
    return { id: order.id as string };
  });

export const capturePaypalOrder = createServerFn({ method: "POST" })
  .validator((d: { orderId: string }) => d)
  .handler(async ({ data }) => {
    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${data.orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal capture order failed: ${err}`);
    }
    const result = await res.json();
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    return {
      status: result.status as string,
      captureId: capture?.id ?? "",
      amount: capture?.amount?.value ?? "",
    };
  });
