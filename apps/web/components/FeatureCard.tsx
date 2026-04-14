'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

export function FeatureCard({ title, description, icon, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      style={{
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--border-radius)',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="glass-card"
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))',
          color: 'var(--color-primary-800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem',
        }}
      >
        {icon}
      </div>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      
      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
        {description}
      </p>

      {/* Decorative gradient glow on hover could be added via CSS classes */}
      <div className="card-glow" />
    </motion.div>
  );
}
