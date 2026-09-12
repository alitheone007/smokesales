import { CartToast } from "./components/CartToast"
import { CookieConsent } from "./components/CookieConsent"
import { TopBar } from "./components/TopBar"
import { Categories } from "./sections/Categories"
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
    <div id="top" className="min-h-screen bg-canvas font-body text-ink">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Categories />
        <NewArrivals />
        <ProductGrid />
        <HowItWorks />
        <GetStarted />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
      <CartToast />
      <CookieConsent />
    </div>
  )
}
