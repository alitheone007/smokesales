import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import AdminApp from "./admin/AdminApp.tsx"
import "./index.css"
import { ThemeProvider } from "./lib/theme.tsx"
import { ToastProvider } from "./lib/toast.tsx"

// Simple hash-based split: visiting .../#admin loads the admin panel instead
// of the storefront. Checked once at boot, not on every hash change, so the
// marketing page's own in-page anchors (#categories, #hot, ...) don't
// accidentally trigger it.
const isAdminRoute = window.location.hash === "#admin"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>{isAdminRoute ? <AdminApp /> : <App />}</ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
