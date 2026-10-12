import { CartDrawer } from "./components/CartDrawer"
import { CartToast } from "./components/CartToast"
import { CookieConsent } from "./components/CookieConsent"
import { SignInModal } from "./components/SignInModal"
import { TopBar } from "./components/TopBar"
import { AuthProvider } from "./lib/auth"
import { CartProvider } from "./lib/cart"
import { Categories } from "./sections/Categories"
import { Catalog } from "./sections/Catalog"
import { Checkout } from "./sections/Checkout"
import { FAQ } from "./sections/FAQ"
import { Footer } from "./sections/Footer"
import { GetStarted } from "./sections/GetStarted"
import { Header } from "./sections/Header"
import { Hero } from "./sections/Hero"
import { HowItWorks } from "./sections/HowItWorks"
import { NewArrivals } from "./sections/NewArrivals"
import { Newsletter } from "./sections/Newsletter"
import { ProductGrid } from "./sections/ProductGrid"
import { TrustStrip } from "./sections/TrustStrip"

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div id="top" className="min-h-screen bg-canvas font-body text-ink">
          <TopBar />
          <Header />
          <main>
            <Hero />
            <TrustStrip />
            <Categories />
            <Catalog />
            <NewArrivals />
            <ProductGrid />
            <HowItWorks />
            <GetStarted />
            <Checkout />
            <FAQ />
            <Newsletter />
          </main>
          <Footer />
          <CartDrawer />
          <CartToast />
          <CookieConsent />
          <SignInModal />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
