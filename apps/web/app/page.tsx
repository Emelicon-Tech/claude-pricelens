import { HeroAnimation } from '../components/HeroAnimation';
import { FeatureCard } from '../components/FeatureCard';
import { BarChart3, ScanLine, MapPin, Store, Brain, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main style={{ background: 'var(--color-primary-950)', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ── Navigation ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>
          <span style={{ color: 'var(--color-primary-400)' }}>Price</span>Lens
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Sign In</Link>
          <Link href="/register" className="btn btn-primary" style={{ background: 'var(--color-primary-500)', border: 'none' }}>
            Get Early Access
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '5rem 5% 8rem 5%',
        gap: '4rem',
        position: 'relative'
      }}>
        {/* Abstract Top-Left Glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div style={{ flex: '1.2', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '2rem', marginBottom: '2rem', color: 'var(--color-primary-300)', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ display: 'block', width: '8px', height: '8px', background: 'var(--color-primary-400)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-primary-400)' }} />
            The Future of Retail in Africa
          </div>
          
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Never Overpay for <br/>
            <span className="text-gradient">Groceries Again.</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', lineHeight: 1.6, marginBottom: '3rem' }}>
            PriceLens compares real-time FMCG prices across supermarkets, open markets, and wholesalers in Nigeria. From Peak Milk to Indomie, get the smartest basket insights powered by AI.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/register" className="btn btn-xl" style={{ background: '#fff', color: 'var(--color-primary-950)', fontSize: '1.1rem', fontWeight: 700, padding: '1rem 2.5rem' }}>
              Start Saving Now
            </Link>
            <Link href="#features" className="btn btn-xl btn-ghost" style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              See How It Works
            </Link>
          </div>
          
          <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>117+</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary-300)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Stores Tracked</span>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>₦4.2M</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary-300)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Savings Found</span>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>6</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary-300)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>States Active</span>
            </div>
          </div>
        </div>

        <div style={{ flex: '1', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
          <HeroAnimation />
        </div>
      </section>

      {/* ── Features Matrix ── */}
      <section id="features" style={{ padding: '8rem 5%', background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Built for the Nigerian Reality</h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)' }}>
            Inflation is unpredictable. PriceLens brings absolute transparency to local retail pricing, utilizing advanced AI and community-driven data.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <FeatureCard 
            title="Supermarket vs Open Market"
            description="Instantly compare arbitrary prices between structured retail (Shoprite, Spar) and local open markets (Mile 12, Wuse)."
            icon={<Store size={24} />}
            delay={0.1}
          />
          <FeatureCard 
            title="Location-Aware Intelligence"
            description="Turn on your GPS and PriceLens finds the cheapest genuine merchants within a 5km radius to minimize your transport cost."
            icon={<MapPin size={24} />}
            delay={0.2}
          />
          <FeatureCard 
            title="AI Receipt Scanner"
            description="Just snap a photo of your grocery receipt. Our OCR engine extracts the items and tells you if you overpaid."
            icon={<ScanLine size={24} />}
            delay={0.3}
          />
          <FeatureCard 
            title="Historical Price Trends"
            description="Track how the price of Milo or Indomie has changed over the last 6 months to predict the best time to bulk-buy."
            icon={<TrendingDown size={24} />}
            delay={0.4}
          />
          <FeatureCard 
            title="Smart Shopping Lists"
            description="Build your monthly provision list and let our algorithm route you to the combination of stores offering the cheapest total basket."
            icon={<BarChart3 size={24} />}
            delay={0.5}
          />
          <FeatureCard 
            title="Enterprise Analytics API"
            description="For FMCG brands & Distributors. Get real-time geographical pricing data to monitor your brand's retail compliance."
            icon={<Brain size={24} />}
            delay={0.6}
          />
        </div>
      </section>

      {/* ── CTA / Footer ── */}
      <footer style={{ padding: '6rem 5%', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: '#fff' }}>Ready to optimize your basket?</h2>
        <Link href="/register" className="btn btn-xl" style={{ background: 'var(--color-primary-500)', color: '#fff', fontSize: '1.2rem', padding: '1.2rem 3rem', borderRadius: '3rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
          Create Your Free Account
        </Link>
        <div style={{ marginTop: '4rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          &copy; 2026 PriceLens Nigeria Platform. All rights reserved.
        </div>
      </footer>
    </main>
  );
}