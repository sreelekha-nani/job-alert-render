import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "../contexts/AuthContext";
import { ATSProvider } from "../contexts/ATSContext"; // NEW: Import ATSProvider

// Create QueryClient ONCE (outside component)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppProviders = ({ children }: { children?: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ATSProvider> {/* NEW: Wrap RouterProvider with ATSProvider */}
          {/* Router must be INSIDE AuthProvider and ATSProvider */}
          <RouterProvider router={router} />
          {children}
        </ATSProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
