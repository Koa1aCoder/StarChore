"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import NotificationBanner from "./NotificationBanner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationBanner />
      <Toaster position="top-right" />
      {children}
    </QueryClientProvider>
  );
}
