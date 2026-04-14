'use client';

import { useEffect, useState } from 'react';
import { Receipt, TrendingUp, AlertTriangle, Activity, Calendar, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function ExpensesPage() {
  const [summary, setSummary] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpensesData();
  }, []);

  async function fetchExpensesData() {
    try {
      const summaryRes = await fetch(`${API_URL}/expenses/summary`, { credentials: 'include' });
      if (summaryRes.ok) {
        setSummary(await summaryRes.json());
      }
      
      const forecastRes = await fetch(`${API_URL}/expenses/forecast`, { credentials: 'include' });
      if (forecastRes.ok) {
        setForecast(await forecastRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading financial matrix...</div>;

  const totalSpent = summary?.totalSpent || 0;
  const projectedLoss = (forecast?.forecastedAmount || 0) - (forecast?.historicalBaseline || 0);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff', fontSize: '2rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Receipt size={28} color="var(--color-primary-400)" /> Expense Intel
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Track historical spending against algorithmic inflation projections.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--color-primary-950)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>
            <Calendar size={18} /> Current Month Total
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>
            ₦{totalSpent.toLocaleString()}
          </div>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '1rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', marginBottom: '1rem' }}>
            <TrendingUp size={18} /> AI Projected Overhead (Next Month)
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f87171' }}>
            ₦{forecast?.forecastedAmount?.toLocaleString() || 0}
          </div>
          <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', opacity: 0.1 }}>
            <Activity size={100} color="#f87171" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Forecast AI Insight */}
        {forecast?.insight && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--color-primary-950)', border: '2px solid var(--color-primary-500)', borderRadius: '1rem', padding: '2rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} color="var(--color-primary-400)" /> Financial Prediction Engine
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              {forecast.insight}
            </p>
            {projectedLoss > 0 && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', display: 'inline-block' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Calculated Risk Deficit:</span>
                <span style={{ color: '#f87171', fontWeight: 700, marginLeft: '0.5rem' }}>+₦{projectedLoss.toLocaleString()}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Category Breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '2rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Category Bleed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {summary?.categoryBreakdown?.length > 0 ? summary.categoryBreakdown.map((cat: any, i: number) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{cat.category}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₦{cat.amount.toLocaleString()}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'var(--color-primary-500)', width: `${Math.min(100, (cat.amount / totalSpent) * 100)}%` }} />
                </div>
              </div>
            )) : (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Not enough data to calculate category bleed.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
