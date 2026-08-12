"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/api/useStripe";
import { PackageName } from "@/types/packages";

type PurchaseButtonProps = {
  packageName: PackageName;
};

export function PurchaseButton({
  packageName,
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  console.log(packageName);

  const handlePurchase = async () => {
    try {
      setLoading(true);

      const successUrl = `${window.location.origin}`;
      const cancelUrl = `${window.location.origin}`;

      const {
        data,
        success,
        error,
      } = await createCheckoutSession(
        "A",
        successUrl,
        cancelUrl
      );

      if (!success || !data?.url) {
        console.error(error);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
      onClick={handlePurchase}
      disabled={loading}
    >
      {loading ? "Processing..." : "Purchase Package"}
    </Button>
  );
}