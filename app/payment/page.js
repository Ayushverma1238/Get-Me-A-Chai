import { Suspense } from "react";
import Payment from "@/components/PaymentPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading payment...</div>}>
      <Payment />
    </Suspense>
  );
}
