"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page which contains order history
    router.push("/profile");
  }, [router]);

  return null;
}
