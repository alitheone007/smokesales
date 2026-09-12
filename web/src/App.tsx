import { CartToast } from "./components/CartToast"
import { Categories } from "./sections/Categories"
import { FAQ } from "./sections/FAQ"
import { Footer } from "./sections/Footer"
import { GetStarted } from "./sections/GetStarted"
import { Header } from "./sections/Header"
import { Hero } from "./sections/Hero"
import { HowItWorks } from "./sections/HowItWorks"
import { ProductGrid } from "./sections/ProductGrid"
import { TrustStrip } from "./sections/TrustStrip"

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-canvas font-body text-ink">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Categories />
        <ProductGrid />
        <HowItWorks />
        <GetStarted />
        <FAQ />
      </main>
      <Footer />
      <CartToast />
    </div>
  )
}
