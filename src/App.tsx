
import "./styles/loading.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { CookieConsentProvider } from "@/hooks/use-cookie-consent";
import { queryClient } from "@/lib/query-client";
import { AppLayout } from "@/components/layout/AppLayout";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfileProvider>
        <CookieConsentProvider>
          <AppLayout />
        </CookieConsentProvider>
      </ProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
