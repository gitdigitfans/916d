import { useEffect, useRef, useState } from "react";
import { getPaypalClientId, createPaypalOrder, capturePaypalOrder } from "@/lib/paypal-server";
import { toast } from "sonner";

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  };
}

interface PayPalButtonProps {
  amount: string;
  planName: string;
  onSuccess?: () => void;
  className?: string;
}

export function PayPalButton({ amount, planName, onSuccess, className }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const renderedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { clientId } = await getPaypalClientId();
        if (cancelled) return;

        if (!clientId) {
          console.error("[PayPal] No client ID returned from server");
          setErrorMsg("PAYPAL_CLIENT_ID is not configured on the server.");
          setStatus("error");
          return;
        }

        if (!document.querySelector(`script[src*="paypal"]`)) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load PayPal SDK script"));
            document.head.appendChild(s);
          });
        }

        if (cancelled) return;

        if (!window.paypal) {
          setErrorMsg("PayPal SDK loaded but window.paypal is undefined.");
          setStatus("error");
          return;
        }

        if (renderedRef.current || !containerRef.current) return;
        renderedRef.current = true;

        window.paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 48 },
          async createOrder() {
            const { id } = await createPaypalOrder({ data: { amount, planName } });
            return id;
          },
          async onApprove(data: Record<string, unknown>) {
            const orderId = data.orderID as string;
            const result = await capturePaypalOrder({ data: { orderId } });
            if (result.status === "COMPLETED") {
              toast.success(`Payment of $${result.amount} confirmed!`);
              onSuccess?.();
            } else {
              toast.error("Payment was not completed. Please try again.");
            }
          },
          onError() {
            toast.error("An error occurred with PayPal. Please try again.");
          },
        }).render(containerRef.current);

        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("[PayPal] Init error:", msg);
          setErrorMsg(msg);
          setStatus("error");
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, [amount, planName, onSuccess]);

  return (
    <div className={className}>
      {status === "loading" && (
        <div className="flex h-12 items-center justify-center text-xs text-muted-foreground">
          Loading PayPal...
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <p className="font-semibold">PayPal unavailable</p>
          <p className="mt-1 break-all opacity-80">{errorMsg}</p>
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
