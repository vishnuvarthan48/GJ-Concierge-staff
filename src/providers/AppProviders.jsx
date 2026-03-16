import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "../theme/createTheme";
import { useThemeMode } from "../hooks/useThemeMode";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./AuthProvider";

export default function AppProviders({ children }) {
  const { mode } = useThemeMode();
  const theme = createAppTheme(mode);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
      },
    },
  });
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
