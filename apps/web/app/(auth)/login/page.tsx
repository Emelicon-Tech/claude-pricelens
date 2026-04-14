'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '0.75rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const iconWrap: React.CSSProperties = {
    position: 'absolute',
    left: '0.85rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.4)',
    pointerEvents: 'none',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-primary-950)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '3rem',
          borderRadius: '1.25rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', textDecoration: 'none' }}>
          <img src="/logo.png" alt="PriceLens Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', borderRadius: '0.5rem' }} />
          <span style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#fff' }}>
            <span style={{ color: 'var(--color-primary-400)' }}>Price</span>Lens
          </span>
        </Link>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          Welcome back
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>Create one free</Link>
        </p>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.75rem',
            color: '#fca5a5',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={iconWrap}><Mail size={16} /></span>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com" style={inputStyle}
                autoComplete="email" />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary-400)', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={iconWrap}><Lock size={16} /></span>
              <input name="password" type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={handleChange} required
                placeholder="Enter your password" style={inputStyle}
                autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
              }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '1rem',
            background: loading ? 'rgba(52, 211, 153, 0.5)' : 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
            border: 'none',
            borderRadius: '0.75rem',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}>
            {loading && <Loader2 size={18} className="spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button disabled style={{
            width: '100%',
            padding: '0.85rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google (coming soon)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
