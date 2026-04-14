'use client';

import { useState, useRef } from 'react';
import { Store, DollarSign, Camera, X, Check, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export function ReportPriceModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [storeName, setStoreName] = useState(''); // E.g., we'll map to a real store ID later
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!file) {
      setErrorMsg('Receipt image is STRICTLY required to verify prices.');
      return;
    }

    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', product.id);
      
      // For mockup purposes we'll grab the first store from the product's known prices
      // OR we just send a mock constant if none exists
      const mockStoreId = product.prices?.[0]?.storeId || 'cm261xyza0001mock-store-id'; 
      formData.append('storeId', mockStoreId);
      formData.append('amount', amount.toString());

      const res = await fetch(`${API_URL}/receipts/scan`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to verify receipt.');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); // Reload to fetch newly verified prices
      }, 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--color-primary-900)', border: '1px solid var(--color-primary-500)',
          padding: '2.5rem', borderRadius: '1rem', textAlign: 'center', color: '#fff', width: '90%', maxWidth: '400px'
        }}>
          <ShieldCheck size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Price Trust Verified!</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>
            The AI successfully matched your receipt against strict verifiability rules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--color-primary-950)', border: '1px solid rgba(255,255,255,0.1)',
        padding: '2rem', borderRadius: '1rem', color: '#fff', width: '90%', maxWidth: '400px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="#34d399" />
          Verify Price via Receipt
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
          To maintain data integrity, we solely accept digitally printed receipts from verifiable vendors. Handwritten dockets are automatically rejected.
        </p>

        {errorMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Observed Price (₦)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={16} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="number" required placeholder="e.g. 5000" value={amount} onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Vendor Context</label>
            <div style={{ position: 'relative' }}>
              <Store size={16} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" required placeholder="Vendor will be matched..." value={storeName} onChange={(e) => setStoreName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff' }}
              />
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/jpeg, image/png, image/webp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />

          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
              padding: '1rem', background: file ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)', 
              border: file ? '1px solid #34d399' : '1px dash rgba(255,255,255,0.2)', 
              borderRadius: '0.5rem', color: file ? '#34d399' : '#fff', cursor: 'pointer', marginTop: '0.5rem' 
            }}
          >
            {file ? <><Check size={18} /> {file.name}</> : <><Camera size={18} /> Upload Authentic Receipt</>}
          </button>

          <button type="submit" disabled={submitting || !file} style={{
            marginTop: '1rem', padding: '1rem', background: 'var(--color-primary-500)',
            color: '#000', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer',
            opacity: submitting || !file ? 0.5 : 1, transition: 'all 0.2s'
          }}>
            {submitting ? 'Authenticating with AI Scan...' : 'Submit Evidence'}
          </button>
        </form>
      </div>
    </div>
  );
}
