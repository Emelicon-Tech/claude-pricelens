'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, ArrowRight, Barcode, Building2, Globe, Wallet } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0 }: {
  title: string; value: string; subtitle: string; icon: any; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card"
      style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, margin: 0 }}>
            {title}
          </p>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0 0' }}>{value}</h3>
        </div>
        <div style={{
          width: '42px', height: '42px', borderRadius: '0.75rem',
          background: `${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          <Icon size={20} />
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{subtitle}</p>
      <div className="card-glow" />
    </motion.div>
  );
}

export function DashboardHome() {
  return (
    <div>
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '2rem',
          borderRadius: '1rem',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem 0' }}>
          Welcome to PriceLens 🎉
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
          Your retail intelligence dashboard is active. Start comparing prices, building shopping lists,
          and tracking your monthly grocery expenses across supermarkets and open markets in Nigeria.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard title="Products Tracked" value="67+" subtitle="FMCG staples across 20 categories" icon={Barcode} color="#34d399" delay={0.1} />
        <StatCard title="Stores Mapped" value="117+" subtitle="Supermarkets & open markets" icon={Building2} color="#60a5fa" delay={0.2} />
        <StatCard title="States Active" value="6" subtitle="Lagos, Abuja, Enugu, Rivers, Kano, Kaduna" icon={Globe} color="#f59e0b" delay={0.3} />
        <StatCard title="Avg. Savings" value="₦4,200" subtitle="Per monthly grocery basket" icon={Wallet} color="#a78bfa" delay={0.4} />
      </div>

      {/* Quick actions */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <Link href="/dashboard/shopping-lists" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ y: -3 }} className="glass-card" style={{
            padding: '1.25rem', borderRadius: '1rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(52, 211, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <ShoppingCart size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontWeight: 600 }}>Create Shopping List</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Optimize your grocery basket</p>
              </div>
            </div>
            <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
            <div className="card-glow" />
          </motion.div>
        </Link>

        <Link href="/dashboard/analytics" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ y: -3 }} className="glass-card" style={{
            padding: '1.25rem', borderRadius: '1rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(96, 165, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontWeight: 600 }}>Compare Prices</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Find the cheapest stores near you</p>
              </div>
            </div>
            <ArrowRight size={16} color="rgba(255,255,255,0.3)" />
            <div className="card-glow" />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
