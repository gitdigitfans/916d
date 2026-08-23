import { useEffect, useRef, useState } from "react";
import { getPaypalClientId, createPaypalOrder, capturePaypalOrder } from "@/lib/paypal-server";
import { toast } from "sonner";

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

interface PayPalButtonProps {
  amount: string;
  planName: string;
  onSuccess?: () => void;
  className?: string;
}

export function PayPalButton({ amount, planName, onSuccess, className }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const renderedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { clientId } = await getPaypalClientId();
        if (!clientId || cancelled) return;

        if (!document.querySelector(`script[src*="paypal"]`)) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => reject(new Error("Failed to load PayPal SDK"));
            document.head.appendChild(s);
          });
        }

        if (cancelled || !window.paypal || renderedRef.current || !containerRef.current) return;
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

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error("PayPal init error:", err);
          setError(true);
          setLoading(false);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, [amount, planName, onSuccess]);

  if (error) return null;

  return (
    <div className={className}>
      {loading && (
        <div className="flex h-12 items-center justify-center text-xs text-muted-foreground">
          Loading PayPal...
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
