'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/app/(dashboard)/layout';
import { Search, TrendingUp, Filter, Activity, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { PriceComparisonView } from '@/components/prices/PriceComparisonView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AnalyticsPage() {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const query = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : '';
        const res = await fetch(`${API_URL}/products${query}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [debouncedSearch]);

  if (selectedProduct) {
    return (
      <PriceComparisonView 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
      />
    );
  }

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem 0' }}>
          Real-Time Price Intelligence
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Search for FMCG staples and compare prices across supermarkets and open markets in {user?.city?.name || 'your area'}.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '2rem',
        background: 'rgba(255,255,255,0.03)',
        padding: '0.5rem',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)',
          borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <Search size={18} color="rgba(255,255,255,0.4)" />
          <input 
            type="text"
            placeholder="Search for Milk, Rice, Toiletries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: '#fff', fontSize: '1rem', outline: 'none'
            }}
          />
          {loading && <Activity size={16} color="var(--color-primary-400)" className="spin" />}
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0 1.25rem', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
          color: '#fff', cursor: 'pointer', fontWeight: 500
        }}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Product Grid */}
      {products.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.4)' }}>
          <Store size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No products found matching "{searchQuery}".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <AnimatePresence>
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
                onClick={() => setSelectedProduct(product)} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
