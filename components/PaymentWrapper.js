"use client";
import { useEffect, useState } from "react";
import PaymentPage from "./PaymentPage";

export default function PaymentWrapper({ username }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return <PaymentPage username={username} />;
}
