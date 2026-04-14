'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckBox, Check, Zap, AlertCircle, Activity, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    // Check if we just returned from Paystack checkout (success redirect)
    const reference = searchParams?.get('reference');
    if (reference) {
      verifyPayment(reference);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPlans();
    fetchStatus();
  }, []);

  async function fetchPlans() {
    try {
      const res = await fetch(`${API_URL}/subscriptions/plans`);
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchStatus() {
    try {
      const res = await fetch(`${API_URL}/subscriptions/status`, { credentials: 'include' });
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function verifyPayment(reference: string) {
    setVerifying(true);
    try {
      const res = await fetch(`${API_URL}/subscriptions/verify/${reference}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        // Automatically fetch new status
        fetchStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
      // Clean URL logic could go here
    }
  }

  async function handleSubscribe(interval: string) {
    setSubscribeLoading(interval);
    try {
      const res = await fetch(`${API_URL}/subscriptions/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
        credentials: 'include'
      });
      const data = await res.json();
      
      if (res.ok && data.authorization_url) {
        // Redirect to Paystack or Mock URL
        window.location.href = data.authorization_url;
      } else {
        alert(data.message || 'Failed to initialize payment');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while connecting to payment provider');
    } finally {
      setSubscribeLoading(null);
    }
  }

  if (loading || verifying) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem', color: 'rgba(255,255,255,0.5)' }}>
        <Activity size={32} className="spin" color="var(--color-primary-500)" />
        {verifying ? 'Verifying your transaction with Paystack...' : 'Loading Subscription Hub...'}
      </div>
    );
  }

  const isPro = status?.plan === 'PRO' && status?.status === 'ACTIVE';

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>
          Choose the right plan for <br/> <span style={{ color: 'var(--color-primary-400)' }}>intelligent trading.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Whether you are managing household budgets or running a major retail logistics operation, PriceLens offers enterprise-grade analytics to stretch every Naira.
        </p>
      </div>

      {isPro && (
        <div style={{
          maxWidth: '800px', margin: '0 auto 3rem auto', padding: '1.5rem',
          background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} color="#000" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#34d399', fontSize: '1.25rem' }}>You are on PriceLens Pro!</h3>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>
              Your {status.interval.toLowerCase()} subscription is active. You have full access to Unlimited Comparisons, AI Basket Optimizer, and Deep Analytics.
            </p>
            {status.currentPeriodEnd && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                Next billing date: {new Date(status.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* FREE PLAN */}
        <motion.div whileHover={!isPro ? { y: -5 } : {}} style={{
          padding: '2.5rem', background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.5rem',
          display: 'flex', flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#fff' }}>Free</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 1.5rem 0', minHeight: '40px' }}>Perfect to get started exploring local markets.</p>
          
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '2rem' }}>
            ₦0 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/forever</span>
          </div>

          <button disabled style={{
            padding: '1rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
            border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'not-allowed',
            marginBottom: '2rem'
          }}>
            {isPro ? 'Included' : 'Current Plan'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {plans.find((p) => p.id === 'free')?.features.map((f: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                <Check size={18} color="rgba(255,255,255,0.3)" /> {f}
              </div>
            ))}
          </div>
        </motion.div>

        {/* PRO PLAN */}
        <motion.div whileHover={!isPro ? { y: -5 } : {}} style={{
          padding: '2.5rem', background: 'var(--color-primary-950)',
          border: '2px solid var(--color-primary-500)', borderRadius: '1.5rem',
          display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '-2.5rem', background: 'var(--color-primary-500)', color: '#000', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 3rem', transform: 'rotate(45deg)' }}>
            RECOMMENDED
          </div>

          <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={24} color="var(--color-primary-400)" /> Pro
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 1.5rem 0', minHeight: '40px' }}>Unlock full market visibility and analytics.</p>
          
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '2rem' }}>
            ₦1,000 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/month</span>
          </div>

          <button 
            disabled={isPro || subscribeLoading !== null}
            onClick={() => handleSubscribe('MONTHLY')}
            style={{
            padding: '1rem', background: 'var(--color-primary-500)', color: '#000',
            border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem', cursor: isPro ? 'not-allowed' : 'pointer',
            marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            opacity: isPro ? 0.5 : 1
          }}>
            {subscribeLoading === 'MONTHLY' ? <Activity size={18} className="spin" /> : <CreditCard size={18} />}
            {isPro ? 'Active Plan' : 'Go Pro (Monthly)'}
          </button>

          {!isPro && (
             <button 
             disabled={subscribeLoading !== null}
             onClick={() => handleSubscribe('ANNUAL')}
             style={{
             padding: '0.75rem', background: 'transparent', color: 'var(--color-primary-400)',
             border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
             marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
           }}>
             {subscribeLoading === 'ANNUAL' ? <Activity size={14} className="spin" /> : null}
             Save ₦500 w/ Annual Plan (₦11,500/yr)
           </button>
          )}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem', ...(isPro ? { marginTop: '1.5rem' } : {}) }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {plans.find((p) => p.id === 'pro-monthly')?.features.map((f: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#fff', fontSize: '0.9rem' }}>
                <Check size={18} color="var(--color-primary-400)" style={{ flexShrink: 0, marginTop: '2px' }} /> {f}
              </div>
            ))}
          </div>

          <div className="card-glow" />
        </motion.div>
      </div>
      
      {!isPro && (
        <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          <AlertCircle size={14} /> Payments are secured with industry-standard encryption via Paystack.
        </div>
      )}
    </div>
  );
}
