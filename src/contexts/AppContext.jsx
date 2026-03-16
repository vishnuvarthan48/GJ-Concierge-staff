import { ThemeProvider } from "../providers/ThemeProvider";

export default function AppContexts({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
