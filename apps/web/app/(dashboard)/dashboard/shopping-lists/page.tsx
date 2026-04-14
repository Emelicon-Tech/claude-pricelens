'use client';

import { useEffect, useState, useRef } from 'react';
import { ShoppingCart, Upload, Plus, Store, Check, Target, ChevronRight, Activity } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function ShoppingListsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [activeListData, setActiveListData] = useState<any>(null);
  const [optimizeData, setOptimizeData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (activeListId) {
      fetchListDetails(activeListId);
    }
  }, [activeListId]);

  async function fetchLists() {
    try {
      const res = await fetch(`${API_URL}/shopping-lists`, { credentials: 'include' });
      const data = await res.json();
      setLists(Array.isArray(data) ? data : []);
      if (!activeListId && data.length > 0) {
        setActiveListId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchListDetails(id: string) {
    try {
      const res = await fetch(`${API_URL}/shopping-lists/${id}`, { credentials: 'include' });
      const data = await res.json();
      setActiveListData(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function optimizeList(id: string) {
    try {
      const res = await fetch(`${API_URL}/shopping-lists/${id}/optimize`, { credentials: 'include' });
      if (!res.ok) {
         if (res.status === 403) alert('Routing optimization requires PriceLens Pro.');
         throw new Error('Not PRO');
      }
      const data = await res.json();
      setOptimizeData(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', `List from ${file.name}`);

    try {
      const res = await fetch(`${API_URL}/shopping-lists/analyze`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setLists([data, ...lists]);
        setActiveListId(data.id);
      } else {
        alert(data.message || 'Error parsing list');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading cart...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', height: 'calc(100vh - 100px)' }}>
      {/* Sidebar: All Lists */}
      <div style={{ background: 'var(--color-primary-950)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', overflowY: 'auto' }}>
        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingCart size={18} /> My Lists
        </h3>
        
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,.pdf" style={{ display: 'none' }} />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ width: '100%', padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px dashed rgba(52, 211, 153, 0.4)', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
        >
          {uploading ? <Activity size={16} className="spin" /> : <Upload size={16} />}
          {uploading ? 'Analyzing Image...' : 'AI Import Written List'}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {lists.map(l => (
            <div 
              key={l.id} 
              onClick={() => { setActiveListId(l.id); setOptimizeData(null); }}
              style={{ padding: '1rem', borderRadius: '0.5rem', cursor: 'pointer', background: activeListId === l.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid', borderColor: activeListId === l.id ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.2s' }}
            >
              <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{l.name}</h4>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{l._count?.items || l.items?.length || 0} items</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Active List & Optimizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {activeListData ? (
          <>
            <div style={{ background: 'var(--color-primary-950)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>{activeListData.name}</h2>
                <button 
                  onClick={() => optimizeList(activeListData.id)}
                  style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary-500)', color: '#000', border: 'none', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                  <Target size={18} /> Route Optimizer
                </button>
              </div>

              {optimizeData && (
                <div style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h4 style={{ color: '#34d399', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>True-Cost Transport Analysis</h4>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                    {optimizeData.message}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeListData.items?.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <h4 style={{ color: '#fff', margin: '0 0 0.25rem 0' }}>{item.product.name}</h4>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{item.quantity} x {item.unit || item.product.unit}</span>
                    </div>
                    {item.product.prices?.[0] && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#34d399', fontWeight: 600 }}>est. ₦{Number(item.product.prices[0].amount).toLocaleString()}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>at {item.product.prices[0].store.name}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {optimizeData?.recommendation && (
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem' }}>
                <h3 style={{ color: '#fff', margin: '0 0 1.5rem 0' }}>Cheapest Basket Options</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {optimizeData.allOptions.slice(0,3).map((opt: any, idx: number) => (
                    <div key={idx} style={{ padding: '1.5rem', background: idx === 0 ? 'rgba(52, 211, 153, 0.05)' : 'rgba(0,0,0,0.2)', border: idx === 0 ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.05)', borderRadius: '0.75rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Option {idx + 1}</div>
                      <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Store size={16} /> {opt.store.name}
                      </h4>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, Repcolor: '#fff', marginBottom: '0.25rem', color: idx === 0 ? '#34d399' : '#fff' }}>
                        ₦{opt.total.toLocaleString()}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Inventory: {opt.coverage}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
            Select a list to view its contents or import a new one.
          </div>
        )}
      </div>
    </div>
  );
}
