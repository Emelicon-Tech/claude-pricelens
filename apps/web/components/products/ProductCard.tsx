'use client';

import { motion } from 'framer-motion';
import { Package, ArrowRight, Building2 } from 'lucide-react';

export function ProductCard({ product, index, onClick }: { product: any; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="glass-card"
      style={{
        padding: '1.25rem',
        borderRadius: '1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '0.75rem',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-primary-400)'
        }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} />
          ) : (
            <Package size={24} />
          )}
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            {product.category?.name} • {product.unit}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          <Building2 size={14} />
          {product._count?.prices || 0} stores tracking
        </div>
        <div style={{ color: 'var(--color-primary-400)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 500 }}>
          Compare <ArrowRight size={14} />
        </div>
      </div>
      <div className="card-glow" />
    </motion.div>
  );
}
