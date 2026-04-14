'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Store, AlertCircle, ShoppingCart, Lock, ShieldCheck } from 'lucide-react';
import { useUser } from '@/app/(dashboard)/layout';
import { motion } from 'framer-motion';

import { ReportPriceModal } from './ReportPriceModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export function PriceComparisonView({ product, onBack }: { product: any; onBack: () => void }) {
  const user = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchCompare() {
      try {
        const query = user?.city?.id ? `?cityId=${user.city.id}` : '';
        const res = await fetch(`${API_URL}/prices/compare/${product.id}${query}`, {
          credentials: 'include'
        });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCompare();
  }, [product.id, user]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ paddingBottom: '2rem' }}>
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '0.9rem'
      }}>
        <ArrowLeft size={16} /> Back to Search
      </button>

      {/* Product Header */}
      <div style={{
        display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem',
        padding: '1.5rem', background: 'rgba(255,255,255,0.03)',
        borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '1rem',
          background: 'rgba(52, 211, 153, 0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#34d399'
        }}>
          <ShoppingCart size={32} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#fff' }}>
            {product.name}
          </h2>
          <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            <span>{product.category?.name}</span>
            <span>•</span>
            <span>{product.unit}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> {user?.city?.name || 'Local Area'}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(255,255,255,0.5)' }}>
          Loading prices...
        </div>
      ) : !data || data.prices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Store size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>No prices found</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Be the first to report a price for {product.name} in your area.</p>
          <button 
            onClick={() => setShowModal(true)}
            style={{
            marginTop: '1.5rem', padding: '0.75rem 1.5rem',
            background: 'var(--color-primary-500)', color: '#000',
            border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer'
          }}>
            Report a Price
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
          {/* Price List */}
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Available in {data.meta.totalStores} stores
              
              <button 
                onClick={() => setShowModal(true)}
                style={{
                fontSize: '0.8rem', padding: '0.4rem 0.8rem',
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: 'none', borderRadius: '0.25rem', cursor: 'pointer'
              }}>
                Report Price
              </button>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.prices.map((p: any, idx: number) => {
                const isCheapest = idx === 0;
                return (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem', background: isCheapest ? 'rgba(52, 211, 153, 0.05)' : 'rgba(255,255,255,0.02)',
                    border: isCheapest ? '1px solid rgba(52, 211, 153, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '0.75rem'
                  }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Store size={18} color="#fff" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {p.store.name}
                          {p.isVerified && <ShieldCheck size={14} color="#34d399" title="Verified by AI Receipt Scan" />}
                        </h4>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                          {p.store.city?.name}, {p.store.city?.state?.name}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isCheapest ? '#34d399' : '#fff' }}>
                        ₦{Number(p.amount).toLocaleString()}
                      </div>
                      {isCheapest && <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>BEST PRICE</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {data.meta.isLimited && (
              <div style={{
                marginTop: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '0.75rem',
                display: 'flex', alignItems: 'center', gap: '1rem'
              }}>
                <Lock size={20} color="#f59e0b" />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '0.9rem' }}>{data.meta.upgradeMessage}</h4>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                    Upgrade to PriceLens Pro to unlock all store comparisons and historical charts.
                  </p>
                </div>
                <button style={{
                  padding: '0.5rem 1rem', background: '#f59e0b', color: '#000',
                  border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'
                }}>
                  Upgrade
                </button>
              </div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div>
            <div style={{
              padding: '1.5rem', background: 'rgba(255,255,255,0.03)',
              borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)',
              position: 'sticky', top: '2rem'
            }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: '0 0 1.5rem 0' }}>Price Intelligence</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>Lowest Price</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399' }}>₦{data.stats.cheapest.toLocaleString()}</div>
                </div>
                
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>Average Price</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>₦{data.stats.average.toLocaleString()}</div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>Potential Savings</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#60a5fa' }}>₦{data.stats.savings.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Difference between highest and lowest</div>
                </div>
              </div>

              <div style={{
                marginTop: '2rem', padding: '1rem', background: 'rgba(52, 211, 153, 0.05)',
                borderRadius: '0.5rem', border: '1px solid rgba(52, 211, 153, 0.1)',
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
              }}>
                <AlertCircle size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Prices are crowdsourced and verified by receipt scans. They may vary slightly by branch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showModal && (
        <ReportPriceModal 
          product={product} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </motion.div>
  );
}
